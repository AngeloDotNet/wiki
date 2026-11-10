# CLAUDE.md

## Documentazione di SagreEventi (`docs/sagreeventi/`)

- **Sorgente unica:** le pagine di documentazione di SagreEventi vivono solo qui (decisione dell'utente del 2026-11-08). Il repository applicativo `AngeloDotNet/SagreEventi` non conserva copie di `docs/*.md` né degli screenshot: il README e il DEPLOY linkano le pagine di questa wiki (`http://wiki.aepserver.it/sagreeventi/<pagina>`).
- **Lingua:** italiano per il testo delle pagine; nomi di file, identificatori ed endpoint restano nella forma originale.
- **Percorsi:** in tutta la wiki (`docs/sagreeventi/` e `docs/claude-config/`) niente percorsi reali del PC in uso (unità, cartelle utente, cartelle dei progetti): solo segnaposto generici, per esempio `/percorso/del/progetto`. Prima di chiudere un intervento si cerca `Disco_E` e `C:\Users` con Grep (decisione dell'utente del 2026-11-10).
- **Fonte di verità:** le pagine descrivono il comportamento del repository applicativo. Quando il codice cambia, la pagina cambia nello stesso intervento (o si annota in `CHECKLIST.md`).
- **Front matter:** ogni pagina ha `title` e `sidebar_position`. Link tra pagine con percorsi relativi (`api.md`); link al repository con URL assoluto.
- **Screenshot:** in `static/img/`, riferiti con percorso assoluto dal sito (`/img/<file>.png`).
- **Verifica:** prima di chiudere un intervento, `npm run typecheck` e `npm run build` senza errori. Il build è configurato con `onBrokenLinks: 'throw'`: un link rotto blocca il build.
- **Changelog:** ogni intervento aggiunge una voce in cima a `CHANGELOG.md` (data, **Perché:**, **Cosa:**/**Dove:**, **Verifica:**).
- **Git:** commit locali solo con conferma esplicita dell'utente. Mai push, PR, tag o rilasci senza approvazione (vedi sotto).
- **Dipendenze:** installazione con `npm ci --ignore-scripts`.

## Eccezioni alle regole globali

- **Integrazione GitHub approvata:** PR sì, push sì, tag no, rilasci no (2026-11-07)
