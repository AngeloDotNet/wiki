#!/usr/bin/env node
// Imposta la cartella degli hook versionati (.githooks) per questo clone.
// Non fa nulla fuori da un repository Git (es. nel build Docker, dove .git è escluso).
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

if (!existsSync(join(root, '.git'))) process.exit(0);

try {
  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], {cwd: root, stdio: 'ignore'});
} catch {
  console.warn('install-git-hooks: impossibile impostare core.hooksPath (git non disponibile?).');
}
