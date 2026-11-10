# Changelog

Registro delle modifiche alla wiki unificata (`docs/claude-config/` e `docs/sagreeventi/`). Giorni più recenti in alto; dentro lo stesso giorno, gli interventi più recenti in alto.

## 2026-11-11

### Registrazione della GitHub CLI in `CLAUDE.md`

**Perché:** l'hook `guard-commands` blocca `gh pr create` finché il progetto non registra se `gh` è installata (`git.md`, «Integrazione GitHub»).
**Cosa:** aggiunta la riga «GitHub CLI (gh) installata: sì (2026-11-11)» nella sezione «Eccezioni alle regole globali».
**Dove:** `CLAUDE.md`, `CHANGELOG.md`.
**Verifica:** `npm run typecheck` e `npm run build` senza errori; nessuna occorrenza di `Disco_E` e `C:\Users` in `docs/`.

### Allineamento dei branch locali e pulizia del branch di bugfix

**Perché:** la PR #38 (squash) aveva già portato su `develop` il lavoro di `bugfix/claude-config-docs-allineamento`, e #39 aveva unito `develop` in `main`.
**Cosa:** `main` e `develop` locali portati in fast-forward a `origin` (`6ac0256`, `88caece`); verificato che il bugfix non differiva da `develop` (`git diff` vuoto); cancellato il branch locale. Le modifiche non committate sono rimaste nel working tree, ora su `develop`.
**Dove:** nessun file della wiki; solo stato di git. Annotato in `CHANGELOG.md` e nella voce `sito` del progetto in `kit-progetti.json` (nessun sito esterno).
**Verifica:** `git branch -vv` mostra `develop` e `main` allineati a `origin`. `npm ci --ignore-scripts`, `npm run typecheck` e `npm run build` senza errori né link rotti (resta l'avviso sulla data di aggiornamento dei file non tracciati); nessuna occorrenza di `Disco_E` e `C:\Users` in `docs/`. Questo vale anche per le voci del 2026-11-09 e del 2026-11-10 che riportavano build non eseguita.
**Note:** il branch remoto `bugfix/claude-config-docs-allineamento` è stato cancellato dall'utente (non compare più in `git ls-remote`). Le modifiche non committate sono finite nel commit sul branch `feature/sagreeventi-mappa-frontend`. Restano aperti la verifica di `mappa.md` e delle pagine sul frontend al merge nel repository applicativo e la scelta del `sidebar_position` di `mappa.md`.

## 2026-11-10

### Versione dell'app dal tag di rilascio (SagreEventi)

**Perché:** nel repository applicativo la versione mostrata in Informazioni non viene più da `package.json` incrementato a mano, ma dal tag git `vX.Y.Z` passato dalla CI (`PLAN-versione-da-tag`).
**Cosa:** descritto che la versione è `APP_VERSION` (tag `vX.Y.Z`) con ripiego su `package.json` nelle build senza tag, e che le immagini ricevono anche il tag `X.Y.Z`.
**Dove:** `docs/sagreeventi/informazioni.md`, `docs/sagreeventi/deployment.md`, `docs/sagreeventi/architettura.md`, `CHANGELOG.md`.
**Verifica:** `npm run typecheck` e `npm run build` senza errori (resta l'avviso già presente sulla data di aggiornamento dei file non tracciati); nessun percorso reale nelle pagine toccate.

### Percorsi generici nell'esempio di `kit-progetti.json`

**Perché:** le pagine non devono divulgare percorsi reali del PC in uso (richiesta dell'utente).
**Cosa:** nell'esempio JSON le chiavi e il `percorso` usano segnaposto (`/percorso/del/progetto-con-sito`, `/percorso/della/wiki`) al posto di `E:/Disco_E/Progetti/...`.
**Regola:** aggiunta in `CLAUDE.md` (voce «Percorsi»): vale per tutta la wiki, con la ricerca di `Disco_E` e `C:\Users` prima di chiudere un intervento.
**Dove:** `docs/claude-config/plugin.md`, `CLAUDE.md`, `CHANGELOG.md`.
**Verifica:** ricerca di `Disco_E` e `C:\Users` in tutto il repository (esclusi `node_modules`, `build`): nessun'altra occorrenza. `npm run typecheck` e `npm run build` non eseguiti (mancano le dipendenze).

## 2026-11-09

### Struttura del frontend nelle pagine di SagreEventi

**Perché:** il frontend ha cartelle per elemento (`frontend.md` v1.1): `core/<nome>/`, `shared/<nome>/`, `features/<area>/<pagina>/`. Le pagine citavano i percorsi vecchi e la regola dei confini che il lint ora verifica.
**Cosa:** `architettura.md`: pattern dei test del client (`src/app/**/*.spec.ts`), descrizione delle cartelle per elemento e dei confini verificati dal lint. `informazioni.md`: percorso del file generato `core/build-info-generated/build-info.generated.ts`. `sviluppo.md`: posizione dei test del client e il lint che controlla anche i confini.
**Dove:** `docs/sagreeventi/architettura.md`, `docs/sagreeventi/informazioni.md`, `docs/sagreeventi/sviluppo.md`, `CHANGELOG.md`.
**Verifica:** percorsi verificati sul repository applicativo dopo il refactoring (P1–P4: `core/`, `shared/`, `features/` nel working tree, non ancora committato). `npm run typecheck` e `npm run build` senza errori né link rotti.
**Note:** la descrizione vale quando il refactoring sarà committato su `develop`. Le altre modifiche non committate di questa cartella (`configurazione.md`, `intro.md`, `mappa.md`) non sono state toccate.

### Pagina Mappa e posizione per SagreEventi

**Perché:** la mappa degli eventi (fasi A2–A4 del GPS) manda dati a servizi esterni e ha impostazioni nuove in `config.json`. Chi usa l'app o configura il deploy deve saperlo.
**Cosa:** nuova pagina `docs/sagreeventi/mappa.md` (cosa si vede, servizi esterni e dati inviati, comportamento offline, configurazione `mappa` di `config.json` con le regole https e placeholder, nota sulla CSP, accessibilità). `configurazione.md`: righe `mappa.tileUrl` e `mappa.nominatimUrl`. `intro.md`: riga nella tabella «Da dove iniziare».
**Dove:** `docs/sagreeventi/mappa.md`, `docs/sagreeventi/configurazione.md`, `docs/sagreeventi/intro.md`, `CHANGELOG.md`.
**Verifica:** descrizione verificata sul codice del repository applicativo (branch `feature/gps-eventi`, fasi A2–A4): `config.service.ts` (https, tile con `{z}`, `{x}`, `{y}`), `geocoding.service.ts` (una richiesta al secondo, cache in memoria), `mappa.component.ts` (tile OSM, attribuzione, testo con le coordinate), `evento-form` (limiti di latitudine e longitudine, 6 decimali, coppia obbligatoria, pulsante attivo con la città). `npm run typecheck` e `npm run build` (con `onBrokenLinks: 'throw'`).
**Note:** la pagina descrive il codice in `feature/gps-eventi`, ancora non unito a `develop`: al merge va verificata. Il `sidebar_position` (12) è dopo Informazioni: l'ordine si può cambiare insieme alle altre pagine.

### Documentazione di SagreEventi: sorgente unica nella wiki

**Perché:** le pagine di SagreEventi erano nel repository applicativo e poi in un sito separato (`sagreeventi.docs`, non più presente). La sorgente unica è questa wiki: il repository applicativo ha solo `README.md`, `DEPLOY.md`, `CHANGELOG.md`, `CLAUDE.md`, `CHECKLIST.md` e `docs/piani/`.

**Cosa:** aggiunte al `CLAUDE.md` le regole della documentazione di SagreEventi (sorgente unica, lingua, front matter, screenshot, verifica, changelog, git); creato questo `CHANGELOG.md`.

**Dove:** `CLAUDE.md`, `CHANGELOG.md`.

**Verifica:** confronto con l'ultima versione delle pagine nel repository applicativo (commit `b2e3fe1^`): nessuna pagina mancante. Le differenze sono aggiornamenti già presenti nella wiki (per esempio posizione dell'evento, anti-bot, scadenza automatica, avvisi email) e la rimozione dei link «Torna al README», non più validi in Docusaurus. Screenshot: i tre PNG sono in `static/img/`. `npm ci --ignore-scripts`, `npm run typecheck` e `npm run build` (con `onBrokenLinks: 'throw'`) senza errori.

**Note:** la storia precedente delle pagine è nel repository applicativo (`CHANGELOG.md` del 2026-11-06 e commit fino a `b2e3fe1`). Il link del dominio della documentazione (`http://wiki.aepserver.it`) va verificato online al rilascio.
