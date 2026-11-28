---
sidebar_position: 4
sidebar_label: Cosa contiene
---

# Cosa contiene

```
.claude/
  rules/            moduli caricati da Claude Code in automatico
  rules-optional/   moduli opzionali, NON caricati: si attivano su richiesta
.claude-plugin/     marketplace `claude-config` (marketplace.json)
plugins/kit/ plugin con i dodici controlli personali (in sei script) e i comandi (vedi plugin.md)
plugins/kit/skills/ un comando per cartella, richiamato come `/kit:<nome>` (un `SKILL.md` per comando)
CLAUDE.md           modello del CLAUDE.md di progetto (campi [..] da compilare)
CHANGELOG.md        modifiche alle regole del template (in un progetto nuovo va sostituito)
.editorconfig       solo backend .NET (analyzer di sicurezza a severità error)
NuGet.config        solo backend .NET (package source mapping)
.gitattributes      fine riga (text=auto)
.gitignore          Visual Studio / .NET / Angular, file locali di Claude Code
_template/          materiale del template
```

In un progetto nuovo Claude elimina il materiale che appartiene al template e non al progetto: `_template/`, `.claude-plugin/` e `plugins/`; restano `.claude/rules/` e `.claude/rules-optional/`, così le regole si possono aggiornare, aggiungere o rimuovere anche a progetto avviato; `README.md` e `CHANGELOG.md` si sostituiscono con quelli del progetto (`_template/avvio-progetto.md`, §3).

## Moduli delle regole

I moduli sono elencati in `_template/moduli.json`, che il plugin legge per copiare e confrontare le regole.

| Modulo | Dove | Quando si carica |
|---|---|---|
| `core.md`, `lavoro.md`, `security.md`, `contratto.md` | `rules/` | sempre (`contratto.md` e alcune sezioni di frontend e backend si caricano solo sui file corrispondenti) |
| `git-flusso.md`, `workflow.md`, `qualita.md`, `documentazione.md`, `operativita.md` | `rules/` | profili `standard` e `strutturato` (nel profilo `mini` stanno in `rules-optional/`) |
| `security-avanzata.md` | `rules/` | profili `standard` e `strutturato` |
| `security-strutturato.md` | `rules/` | solo profilo `strutturato` |
| `security-backend.md` | `rules/` | con la sicurezza estesa e il backend; si carica sui file `*.cs`, `*.csproj`, `*.props` |
| `backend.md`, `backend-architecture.md`, `backend-app.md`, `osservabilita.md` | `rules/` | con il backend; si caricano sui file `*.cs`, `*.csproj`, `*.props` (`osservabilita.md` anche su Dockerfile, compose e `observability/`) |
| `frontend.md` | `rules/` | con il frontend Angular; si carica su `*.ts`, `*.html`, `*.css`, `*.scss`, `angular.json`, `tsconfig*.json` |
| `feature-workflow.md`, `backend-email.md`, `backend-infra.md`, `mobile.md`, `docker.md` | `rules-optional/` | opzionali: non si caricano finché non vengono attivati su richiesta |

Il manifest lista anche le versioni brevi di alcuni moduli per il profilo `standard` (in `_template/rules-standard/`).

I moduli per area (`frontend`, `backend` e, se attivato, `docker`) usano l'intestazione `paths:` con glob per estensione, quindi sono identici in ogni progetto e non occupano contesto finché non si tocca un file corrispondente.

Ogni `.md` in `.claude/rules/` viene caricato: non vanno aggiunti file che non siano regole.

## `_template/`

| File | Scopo |
|---|---|
| `avvio-progetto.md` | Procedura che Claude segue per avviare un progetto (nuovo o esistente): domande, ispezioni, scelta dei moduli, compilazione del `CLAUDE.md`, tabella delle decisioni «chiesto, non presunto» con il campo del `CLAUDE.md` e la regola di ciascuna. Non va aperta né citata a Claude: la legge da solo (vedi "Come si usa, in breve" nella [pagina iniziale](intro.md)). |
| `ci/` | Esempi di workflow da adattare al progetto: `ci.yml` (job backend e frontend con build, test, lint e audit a ogni pull request, action fissate allo SHA; non eseguito su GitHub, da verificare al primo uso) e il controllo CI delle deroghe `kit-allow` (`kit-allow.yml`) con lo script che genera il report (`kit-allow-report.mjs`, con i suoi test). |
| `eslint.config.example.js` | Esempio di configurazione ESLint (flat config con `angular-eslint`) che applica le regole di `frontend.md` controllabili da un linter. I nomi delle regole non sono provati su un progetto reale: si verificano con `npm run lint`. |
| `settings.example.json` | Esempio di permessi per `.claude/settings.json` (`deny` per `.env`, chiavi e `secrets/`, `allow` per i comandi di sola verifica). Non si copia da solo: la sintassi va verificata sulla versione di Claude Code installata. |

## Plugin `kit`

I dodici controlli personali, in sei script (blocchi di comandi, segreti e pattern vietati; avvisi di qualità e di pratica; promemoria su piano, chiusura, regole aggiornate e sito di documentazione) stanno nel plugin `plugins/kit/`, distribuito dal marketplace `.claude-plugin/marketplace.json`. Cosa fanno e come si installano: [plugin.md](plugin.md). Dalla versione 1.9.0 il plugin aggiunge anche i comandi `/kit:...` (oggi dieci), uno per cartella in `plugins/kit/skills/`: vedi [Comandi](plugin.md#comandi).
