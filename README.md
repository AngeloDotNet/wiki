# Documentazione

**Wiki unificata in un unico sito Docusaurus: regole e plugin di Claude Code, e documentazione di SagreEventi.**

![Built with Docusaurus](https://img.shields.io/badge/Built%20with-Docusaurus%203-3ECC5F)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

## Introduzione

Questo repository contiene il sito di documentazione che raccoglie due wiki indipendenti, servite dallo stesso build:

- **Claude Code Kit** (`docs/claude-config/`): regole di sviluppo, plugin e template per progetti avviati con [Claude Code](https://claude.com/claude-code).
- **Sagre & Eventi** (`docs/sagreeventi/`): architettura, configurazione, API, deployment e note operative dell'applicazione [SagreEventi](https://github.com/AngeloDotNet/SagreEventi).

Ogni wiki è un'istanza separata del plugin `docs` di Docusaurus, con un proprio identificativo, un proprio percorso di route (`/claude-config`, `/sagreeventi`) e una propria sidebar. La home (`src/pages/index.tsx`) porta alla prima pagina di ciascuna.

## Features

- **Due wiki in un sito**: la navbar passa dall'una all'altra, con sidebar generate dalla cartella `docs/` e ordinate tramite `sidebar_position`.
- **Solo Markdown**: i file `.md` sono interpretati come CommonMark, quindi testi con segnaposto come `<percorso del template>` non vengono letti come JSX.
- **Lingua italiana**: il sito è configurato con una sola locale (`it`).
- **Versione visibile nel footer**: il numero `x.y.z` è letto dal file `VERSION` e aggiornato automaticamente dopo ogni commit (vedi [Versionamento](#versionamento)).
- **Immagine Docker pronta per la produzione**: build statico servito da nginx, con header di sicurezza e Content-Security-Policy calcolata sugli script inline del build.

## Tech stack

- [Docusaurus](https://docusaurus.io/) 3.10 con preset `classic`
- React 19 e TypeScript (`typecheck` con `tsc`)
- Prism per l'evidenziazione del codice (tema GitHub in chiaro, Dracula in scuro)
- Node.js 24 per il build Docker, Node.js 20 o superiore in locale
- nginx (immagine `nginxinc/nginx-unprivileged`) per il runtime, in esecuzione come utente non root sulla porta 8080

## Struttura del progetto

```
.
├── docs/
│   ├── claude-config/      # Wiki Claude Code Kit (Markdown)
│   └── sagreeventi/        # Wiki Sagre & Eventi (Markdown)
├── sidebars/               # Configurazione delle sidebar delle due wiki
├── src/
│   ├── css/custom.css      # Stili globali
│   └── pages/index.tsx     # Home con le due aree
├── static/img/             # Immagini statiche e favicon
├── nginx/                  # Configurazione nginx e header di sicurezza del container
├── scripts/                # Script Node.js: versionamento, CSP, hook Git
├── .githooks/              # Hook Git versionati (post-commit)
├── .github/workflows/      # Workflow GitHub Actions: typecheck e build dell'immagine
├── docusaurus.config.ts    # Configurazione del sito
├── Dockerfile              # Build multi-stage: Node.js → nginx
└── VERSION                 # Versione corrente x.y.z
```

## Getting started

### Prerequisiti

- Node.js 20 o superiore
- npm
- Git (per gli hook di versionamento)

### Installazione e sviluppo

```bash
npm ci          # installa le dipendenze e imposta la cartella degli hook Git
npm start       # avvia il server di sviluppo con ricaricamento a caldo
```

### Altri comandi

| Comando | Effetto |
|---|---|
| `npm run build` | Genera il sito statico in `build/` |
| `npm run serve` | Serve in locale il contenuto di `build/` (da eseguire dopo il build) |
| `npm run typecheck` | Controllo dei tipi TypeScript con `tsc` |
| `npm run clear` | Pulisce la cache di Docusaurus |

### Aggiungere una pagina

Crea un file `.md` nella cartella della wiki (`docs/claude-config/` o `docs/sagreeventi/`) e imposta `sidebar_position` nel front matter per decidere l'ordine nella sidebar. Per i link tra pagine usa percorsi relativi: con `onBrokenLinks: 'throw'` un link rotto blocca il build.

## Docker

Il `Dockerfile` esegue due stadi:

1. **build**: `npm ci`, poi `npm run build` e `node scripts/generate-csp.mjs`, che scrive `.generated/csp.conf` con gli hash SHA-256 degli script inline.
2. **runtime**: copia la configurazione nginx, lo snippet CSP e il contenuto di `build/` in un'immagine nginx non root.

```bash
docker build -t wiki-docs .
docker run --rm -p 8080:8080 wiki-docs
```

Il sito è poi disponibile su `http://localhost:8080`. HTTPS e HSTS non sono gestiti dal container: devono essere forniti dal reverse proxy che lo espone.

Sul server il container si avvia con l'immagine pubblicata su Docker Hub (`image:` nel `docker-compose.yml`), senza build locale.

## Versionamento

Il progetto usa numeri `x.y.z` aggiornati automaticamente dallo script `scripts/bump-version.mjs`, chiamato dall'hook `.githooks/post-commit`. La regola segue i [Conventional Commits](https://www.conventionalcommits.org/) del messaggio di commit:

| Tipo di commit | Effetto sulla versione |
|---|---|
| `feat:` | incrementa `y` (minor) |
| `fix:`, `perf:` | incrementa `z` (patch) |
| `tipo!:` oppure `BREAKING CHANGE:` nel corpo | incrementa `x` (major) |
| altri tipi (`docs:`, `chore:`, ecc.) | nessun cambio |

Lo script aggiorna `VERSION` e `package.json` (anche `package-lock.json`) e crea un commit separato `chore(version): x.y.z`, che non genera un nuovo bump. Per calcolare il cambio senza scrivere nulla:

```bash
node scripts/bump-version.mjs --dry-run
```

## Workflow GitHub Actions

Il workflow `.github/workflows/build-push.yml` si attiva su push e pull request verso `main`:

- installa le dipendenze, esegue `npm run typecheck` e costruisce l'immagine Docker;
- le pull request costruiscono l'immagine ma **non** la pubblicano;
- su `main` l'immagine viene pubblicata su Docker Hub con i tag `latest` e lo SHA del commit. Richiede i segreti `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN`.

## Note di sicurezza

- Il container non contiene segreti né file `.env`: entrambi sono esclusi da `.dockerignore`.
- Il repository e il sito sono pubblici: il link "Modifica questa pagina" è stato tolto, la data di ultimo aggiornamento resta.
- Gli asset con hash nel nome sono serviti con cache di un anno; le pagine HTML con `no-cache`, così una nuova release è visibile subito.
- Lo stile richiede `'unsafe-inline'` nella CSP, perché React imposta attributi `style`; gli script inline sono invece ammessi solo tramite hash.

## Licenza

Distribuito con licenza MIT. Vedi il file [LICENSE](LICENSE).

Copyright © 2026 Angelo Pirola.
