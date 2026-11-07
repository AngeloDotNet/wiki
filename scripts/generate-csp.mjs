// Generates the nginx Content-Security-Policy snippet for the built site.
//
// Docusaurus emits a few inline <script> blocks (theme initialisation, React Helmet).
// A CSP without 'unsafe-inline' can allow them only by hash, so this script scans the HTML
// produced by `docusaurus build`, computes the SHA-256 of every executable inline script and
// writes `.generated/csp.conf`, which the Dockerfile copies into the nginx image.
//
// Styles need 'unsafe-inline' (React renders `style` attributes): a documented derogation of
// security.md, limited to styles.

import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_PATTERN = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const EXECUTABLE_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module']);

/**
 * Returns the sorted, unique CSP hash sources ('sha256-...') of the executable inline
 * scripts found in an HTML document. External scripts (src) and data blocks such as
 * application/ld+json are ignored: the browser does not execute them.
 */
export function collectInlineScriptHashes(html) {
  const hashes = new Set();
  for (const [, attributes, content] of html.matchAll(SCRIPT_PATTERN)) {
    if (/\bsrc\s*=/i.test(attributes)) continue;
    const type = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attributes)?.[1].toLowerCase() ?? '';
    if (!EXECUTABLE_TYPES.has(type)) continue;
    if (content.trim() === '') continue;
    hashes.add(`'sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}'`);
  }
  return [...hashes].sort();
}

/** Builds the Content-Security-Policy header value for the given inline script hashes. */
export function buildPolicy(scriptHashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes.join(' ')}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    // Deroga: docusaurus-theme-github-codeblock scarica nel browser il codice dei blocchi
    // `reference` da raw.githubusercontent.com. Nessun altro host esterno è ammesso.
    "connect-src 'self' https://raw.githubusercontent.com",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

async function findHtmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findHtmlFiles(path)));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

async function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const buildDirectory = join(root, 'build');
  const outputFile = join(root, '.generated', 'csp.conf');

  const hashes = new Set();
  const pages = await findHtmlFiles(buildDirectory);
  if (pages.length === 0) {
    throw new Error(`No HTML files in ${buildDirectory}: run "npm run build" first.`);
  }
  for (const page of pages) {
    for (const hash of collectInlineScriptHashes(await readFile(page, 'utf8'))) hashes.add(hash);
  }

  const policy = buildPolicy([...hashes].sort());
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `add_header Content-Security-Policy "${policy}" always;\n`, 'utf8');
  console.log(`CSP written to .generated/csp.conf (${hashes.size} inline script hashes, ${pages.length} pages)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
