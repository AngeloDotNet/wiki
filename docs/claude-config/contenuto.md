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
plugins/kit/ plugin con i dodici controlli personali (in sette script) e i comandi (vedi plugin.md)
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

| Modulo | Dove | Quando si carica |
|---|---|---|
| `core.md` | `rules/` | all'avvio (sempre) |
| `git.md` | `rules/` | all'avvio (sempre) |
| `security.md` | `rules/` | all'avvio (include la mappa ASVS 5.0, i controlli su API, upload, supply chain, log e una sezione minima sul mobile) |
| `frontend.md` | `rules/` | quando si legge o modifica un `*.ts`, `*.html`, `*.css`, `*.scss` |
| `backend.md`, `backend-architecture.md`, `backend-app.md` | `rules/` | quando si legge o modifica un `*.cs`, `*.csproj`, `*.props` (i tre moduli backend si caricano insieme: stack e regole comuni; architettura e accesso ai dati; logica applicativa, errori e test) |
| `docker.md` | `rules/` | quando si legge o modifica un Dockerfile, un file compose o `docker/**` |
| `feature-workflow.md` | `rules-optional/` | solo fullstack e su conferma: flusso per entità, backend → frontend |
| `backend-email.md` | `rules-optional/` | quando serve l'invio di email |
| `backend-infra.md` | `rules-optional/` | quando servono messaggistica, cache applicativa o eventi |

I moduli per area (`frontend`, `backend`, `docker`) usano l'intestazione `paths:` con glob per estensione, quindi sono identici in ogni progetto e non occupano contesto finché non si tocca un file corrispondente.

Ogni `.md` in `.claude/rules/` viene caricato: non vanno aggiunti file che non siano regole.

## `_template/`

| File | Scopo |
|---|---|
| `avvio-progetto.md` | Procedura che Claude segue per avviare un progetto (nuovo o esistente): domande, ispezioni, scelta dei moduli, compilazione del `CLAUDE.md`. Non va aperta né citata a Claude: la legge da solo (vedi "Come si usa, in breve" nella [pagina iniziale](intro.md)). |
| `ci/` | Esempio di workflow per il controllo CI delle deroghe `kit-allow` (`kit-allow.yml`) e lo script che genera il report (`kit-allow-report.mjs`, con i suoi test). Da adattare al progetto. |

## Plugin `kit`

I dodici controlli personali, in sette script (blocchi di comandi, segreti e pattern vietati; avvisi di qualità e di pratica; promemoria su piano, chiusura e regole aggiornate) stanno nel plugin `plugins/kit/`, distribuito dal marketplace `.claude-plugin/marketplace.json`. Cosa fanno e come si installano: [plugin.md](plugin.md). Dalla versione 1.9.0 il plugin aggiunge anche sedici comandi `/kit:...`, uno per cartella in `plugins/kit/skills/`: vedi [Comandi](plugin.md#comandi).
