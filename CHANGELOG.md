# Changelog

Registro delle modifiche alla wiki unificata (`docs/claude-config/` e `docs/sagreeventi/`). Giorni più recenti in alto; dentro lo stesso giorno, gli interventi più recenti in alto.

## 2026-11-08

### Documentazione di SagreEventi: sorgente unica nella wiki

**Perché:** le pagine di SagreEventi erano nel repository applicativo e poi in un sito separato (`sagreeventi.docs`, non più presente). La sorgente unica è questa wiki: il repository applicativo ha solo `README.md`, `DEPLOY.md`, `CHANGELOG.md`, `CLAUDE.md`, `CHECKLIST.md` e `docs/piani/`.

**Cosa:** aggiunte al `CLAUDE.md` le regole della documentazione di SagreEventi (sorgente unica, lingua, front matter, screenshot, verifica, changelog, git); creato questo `CHANGELOG.md`.

**Dove:** `CLAUDE.md`, `CHANGELOG.md`.

**Verifica:** confronto con l'ultima versione delle pagine nel repository applicativo (commit `b2e3fe1^`): nessuna pagina mancante. Le differenze sono aggiornamenti già presenti nella wiki (per esempio posizione dell'evento, anti-bot, scadenza automatica, avvisi email) e la rimozione dei link «Torna al README», non più validi in Docusaurus. Screenshot: i tre PNG sono in `static/img/`. `npm ci --ignore-scripts`, `npm run typecheck` e `npm run build` (con `onBrokenLinks: 'throw'`) senza errori.

**Note:** la storia precedente delle pagine è nel repository applicativo (`CHANGELOG.md` del 2026-11-06 e commit fino a `b2e3fe1`). Il link del dominio della documentazione (`http://wiki.aepserver.it`) va verificato online al rilascio.
