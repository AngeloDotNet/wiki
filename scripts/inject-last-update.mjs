#!/usr/bin/env node
// Scrive la data di ultimo aggiornamento di ogni pagina nel front matter (last_update.date),
// leggendo la cronologia git. Eseguito dal workflow GitHub Actions prima del build Docker:
// il container non ha .git, quindi senza questo passo Docusaurus non può mostrare la data.
// Le modifiche sono solo nell'albero di lavoro del workflow e non vengono committate.
//
// Uso:
//   node scripts/inject-last-update.mjs            aggiorna docs/
//   node scripts/inject-last-update.mjs <cartella>  aggiorna la cartella indicata (test)
//
// Scrive anche last-update.json alla radice: segnala a docusaurus.config.ts che le date sono pronte.
import {execFileSync} from 'node:child_process';
import {readdirSync, readFileSync, writeFileSync, statSync} from 'node:fs';
import {join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(join(fileURLToPath(import.meta.url), '..', '..'));
const docsDir = resolve(process.argv[2] ?? join(root, 'docs'));

function markdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) files.push(...markdownFiles(path));
    else if (entry.endsWith('.md')) files.push(path);
  }
  return files;
}

// Data dell'ultimo commit che ha toccato il file, in formato ISO 8601 (vuota se il file non è in git).
function lastCommitDate(file) {
  const repoPath = relative(root, file).split(sep).join('/');
  return execFileSync('git', ['log', '-1', '--format=%cI', '--', repoPath], {cwd: root, encoding: 'utf8'}).trim();
}

// Inserisce last_update nel front matter; se non esiste, lo crea. Rispetta LF o CRLF del file.
function withLastUpdate(content, iso) {
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const lines = content.split(/\r?\n/);
  const blockLines = ['last_update:', `  date: '${iso}'`];
  if (lines[0] !== '---') return ['---', ...blockLines, '---', ...lines].join(eol);
  const close = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
  if (close === -1) throw new Error('front matter non chiuso');
  if (lines.slice(1, close).some((line) => /^last_update:/.test(line))) return null; // già presente
  return ['---', ...lines.slice(1, close), ...blockLines, ...lines.slice(close)].join(eol);
}

let updated = 0;
let skipped = 0;
for (const file of markdownFiles(docsDir)) {
  const iso = lastCommitDate(file);
  if (!iso) {
    console.warn(`inject-last-update: nessuna cronologia git per ${relative(root, file)}, saltato`);
    skipped++;
    continue;
  }
  const content = readFileSync(file, 'utf8');
  const next = withLastUpdate(content, iso);
  if (next === null) {
    console.warn(`inject-last-update: last_update già presente in ${relative(root, file)}, saltato`);
    skipped++;
    continue;
  }
  writeFileSync(file, next, 'utf8');
  updated++;
}

writeFileSync(
  join(root, 'last-update.json'),
  JSON.stringify({generatedAt: new Date().toISOString(), updated}, null, 2) + '\n',
  'utf8',
);
console.log(`inject-last-update: ${updated} pagine aggiornate, ${skipped} saltate.`);
