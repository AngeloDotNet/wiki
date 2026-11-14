#!/usr/bin/env node
// Aggiorna la versione x.y.z leggendo il messaggio in Conventional Commits.
// Chiamato dal workflow .github/workflows/build-push.yml a ogni push su main.
//
// Uso:
//   node scripts/bump-version.mjs                      legge il messaggio di HEAD
//   node scripts/bump-version.mjs --message "feat: x"  usa il messaggio passato (test)
//   aggiungere --dry-run per calcolare senza scrivere né committare
//   aggiungere --no-commit per scrivere i file senza creare il commit (lo fa la CI dopo il build)
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const noCommit = args.includes('--no-commit');
const messageIndex = args.indexOf('--message');

function git(gitArgs) {
  return execFileSync('git', gitArgs, {cwd: root, encoding: 'utf8'}).trim();
}

// Restituisce 'major', 'minor', 'patch' oppure null (nessun cambio di versione).
export function bumpKind(message) {
  const header = message.split('\n')[0];
  const match = /^(\w+)(\([^)]*\))?(!)?:\s/.exec(header);
  if (!match) return null;
  const type = match[1].toLowerCase();
  const breaking = Boolean(match[3]) || /^BREAKING[ -]CHANGE:/m.test(message);
  if (type === 'chore' && /^chore\(version\):/.test(header)) return null;
  if (breaking) return 'major';
  if (type === 'feat') return 'minor';
  if (type === 'fix' || type === 'perf') return 'patch';
  return null;
}

export function nextVersion(current, kind) {
  const [x, y, z] = current.split('.').map(Number);
  if (kind === 'major') return `${x + 1}.0.0`;
  if (kind === 'minor') return `${x}.${y + 1}.0`;
  return `${x}.${y}.${z + 1}`;
}

function readJson(file) {
  return JSON.parse(readFileSync(join(root, file), 'utf8'));
}

function writeJson(file, data) {
  writeFileSync(join(root, file), JSON.stringify(data, null, 2) + '\n');
}

function main() {
  const message = messageIndex >= 0 ? args[messageIndex + 1] : git(['log', '-1', '--format=%B']);
  const kind = bumpKind(message);
  if (!kind) {
    console.log('bump-version: nessun cambio di versione per questo commit.');
    return;
  }

  const current = readFileSync(join(root, 'VERSION'), 'utf8').trim();
  const next = nextVersion(current, kind);

  if (dryRun) {
    console.log(`bump-version: ${current} -> ${next} (${kind})`);
    return;
  }

  writeFileSync(join(root, 'VERSION'), next + '\n');

  const pkg = readJson('package.json');
  pkg.version = next;
  writeJson('package.json', pkg);

  const files = ['VERSION', 'package.json'];
  // Il lock file riporta la versione del pacchetto: la aggiorniamo per non sporcare i diff.
  if (existsSync(join(root, 'package-lock.json'))) {
    const lock = readJson('package-lock.json');
    lock.version = next;
    if (lock.packages && lock.packages['']) lock.packages[''].version = next;
    writeJson('package-lock.json', lock);
    files.push('package-lock.json');
  }

  if (noCommit) {
    console.log(`bump-version: ${current} -> ${next} (file aggiornati, commit non creato)`);
    return;
  }

  // Commit separato, limitato ai file della versione. Il suo messaggio è «chore(version): …»,
  // quindi un eventuale bump successivo non ne genera un altro.
  git(['add', '--', ...files]);
  git(['commit', '-m', `chore(version): ${next}`, '--', ...files]);
  console.log(`bump-version: ${current} -> ${next}`);
}

// Esegue solo se lanciato direttamente, non quando il modulo viene importato nei test.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    main();
  } catch (error) {
    console.error(`bump-version: ${error.message}`);
    process.exitCode = 1;
  }
}
