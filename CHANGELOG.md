# Changelog

Registro delle modifiche alla wiki unificata (`docs/claude-config/`, `docs/sagreeventi/` e `docs/license-management/`). Giorni più recenti in alto; dentro lo stesso giorno, gli interventi più recenti in alto.

## 2026-11-14

### Homepage: aree in ordine alfabetico

**Perché:** richiesta dell'utente: le card delle aree in homepage seguivano l'ordine di `wikis.ts`, non quello alfabetico.
**Cosa:** la homepage ordina le card per titolo (`localeCompare` in italiano): Claude Code Kit, License Manager, Sagre & Eventi. Le nuove wiki si ordinano da sole. `wikis.ts` resta invariato (il config ne usa l'ordine).
**Dove:** `src/pages/index.tsx`, `CHANGELOG.md`.
**Verifica:** `npm run typecheck` e `npm run build` senza errori.
**Note:** commit `feat(site)` sul branch `feature/home-alphabetical-order`, insieme alle altre modifiche in sospeso di quel giorno; la versione sale in CI al merge su `main` (oggetto `feat(...)`).

### SagreEventi: modulo di segnalazione a tre passi

**Perché:** il modulo `/eventi/nuovo` e `/eventi/:id/modifica` è stato riorganizzato con uno stepper (Cosa e quando, Dove, Descrizione, con riepilogo prima dell'invio); la pagina sulla mappa descriveva il modulo come una pagina unica.
**Cosa:** `mappa.md`: la riga «Nel modulo di segnalazione e modifica» spiega i tre passi, che il passo «Dove» è facoltativo e che le coordinate a mano stanno in una sezione chiusa. Le altre pagine non descrivono il modulo e non cambiano.
**Dove:** `docs/sagreeventi/mappa.md`, `CHANGELOG.md`.
**Verifica:** solo testo Markdown; `npm run typecheck` e `npm run build` della wiki non eseguiti.
**Note:** il codice del modulo non è ancora committato. Questa voce è nel commit `feat(site)` del branch `feature/home-alphabetical-order`.

### SagreEventi: GPS pubblicato e versione 1.1.0

**Perché:** il frontend del GPS (indirizzo, coordinate, mappa e ricerca indirizzi) è in `develop` con la PR #67 e la release 1.1.0 è pubblicata; la pagina «Informazioni» citava ancora `1.0.0` come versione di `package.json`.
**Cosa:** `informazioni.md`: versione di `package.json` aggiornata a `1.1.0`. Le pagine `mappa.md`, `api.md` e `configurazione.md` descrivevano già il GPS e non cambiano.
**Dove:** `docs/sagreeventi/informazioni.md`, `CHANGELOG.md`.
**Verifica:** solo testo Markdown; `npm run typecheck` e `npm run build` non eseguiti.
**Note:** il GPS non è ancora in produzione: la migrazione `AddPosizioneEventi` va applicata a un SQL Server reale al deploy. Questa voce è nel commit `feat(site)` del branch `feature/home-alphabetical-order`.

### Chiusura del piano e della checklist dell'11/11

**Perché:** i lavori dell'11/11 sono su `main` e il tag `0.6.0` è pubblicato (workflow sul tag concluso con esito positivo, release creata); restavano voci in `PIANO.md` e `CHECKLIST.md` (file non tracciati), da chiudere prima di cancellarli. Decisioni dell'utente.
**Cosa:** punti chiusi come decisioni prese: (1) footer: con un tag `X.Y.Z` vince il tag, nelle build senza tag vale `VERSION` (due fonti accettate, già descritto in `README.md`); (2) tag `latest`: i tag si creano sempre da `main`, quindi `latest` coincide con l'ultimo push su `main`; (3) il tag resta sul commit di merge come da `git.md`, un commit prima del `chore(version)` (il footer non cambia perché il build del tag usa `APP_VERSION`); (4) `develop` resta indietro di un commit `chore(version)` e dei merge commit di `main`, accettato (nessun branch di sincronizzazione); (5) il bump con i merge commit è coperto dalla regola in `CLAUDE.md` (oggetto `feat(...)` o `fix(...)`).
**Dove:** `CHANGELOG.md`; cancellati `PIANO.md` e `CHECKLIST.md`.
**Verifica:** `npm run typecheck` e `npm run build` senza errori, nessuno script di test; solo testo Markdown.
**Note:** resta da provare il ramo del bump con effetto reale: al prossimo rilascio vero, merge su `main` con oggetto `feat(...)` o `fix(...)` e controllo del commit `chore(version)`. Il commit di questa voce non è stato creato.

### Primo tag di rilascio e release su GitHub

**Perché:** provare in pratica il trigger del workflow sui tag `X.Y.Z` senza `v` e avere una prima versione pubblicata con la regola appena scritta in `CLAUDE.md`. Via esplicito dell'utente per ciascuno dei tre passi (creazione del tag, push del tag, release).
**Cosa:** dopo il merge su `main` della PR #56 (merge commit `58572d7`, oggetto `merge: ...`, quindi senza bump) è stato creato il tag annotato `0.6.0` sul commit di merge, coincidente con `VERSION`; il push del tag ha avviato il workflow, concluso con esito positivo (riferito dall'utente). Poi la release `0.6.0` con `gh release`, note in inglese raggruppate in Added, Changed e Notes.
**Dove:** tag `0.6.0` e release `0.6.0` su GitHub; `CHANGELOG.md`.
**Verifica:** `git ls-remote --tags origin` mostra il tag sul remoto. Non verificati da me: i tag dell'immagine su Docker Hub e il footer 0.6.0 (la CI non è leggibile dalle skill).
**Note:** nessun `chore(version)` su `main`, atteso con l'oggetto `merge: ...`. Il commit di questa voce non è stato creato.

### Regola su tag e rilasci in `CLAUDE.md`

**Perché:** nessuna regola diceva quando e come creare tag e rilasci; c'era solo il divieto senza approvazione. Decisione dell'utente: il numero del tag viene da `VERSION` di `main`.
**Cosa:** nuova voce in «Eccezioni alle regole globali»: tag annotato `X.Y.Z` senza `v`, solo da `main` dopo il merge e sul commit di merge; `X.Y.Z` uguale a `VERSION` dopo il commit `chore(version)` del workflow; per far salire la versione il merge commit ha oggetto `feat(...)` o `fix(...)`; via esplicito dell'utente prima del tag, del suo push e di `gh release`.
**Dove:** `CLAUDE.md`, `CHANGELOG.md`.
**Verifica:** `npm run typecheck` e `npm run build` senza errori, nessuno script di test; solo testo Markdown.
**Note:** il tag sul commit di merge precede di un commit il `chore(version)` del workflow, quindi `VERSION` in quel punto è ancora il valore vecchio; il footer non ne risente perché il build del tag usa `APP_VERSION`. Nessun tag creato.

### Tag di rilascio `X.Y.Z`, senza `v`

**Perché:** il kit (`git.md` 1.5 e il plugin `kit` 1.12.0) vuole tag `X.Y.Z` senza prefisso e blocca gli altri nomi, e le pagine di SagreEventi lo usano già; il workflow di questa wiki partiva solo su `vX.Y.Z`, quindi con un tag corretto non sarebbe mai partito. Decisione dell'utente.
**Cosa:** il workflow parte sui tag `X.Y.Z`; il push dell'immagine vale per ogni tag che lo attiva; la versione per il footer si ricava da `refs/tags/X.Y.Z`. Le voci precedenti del CHANGELOG che parlano di `vX.Y.Z` restano come storia.
**Dove:** `.github/workflows/build-push.yml`, `docusaurus.config.ts` (solo commento: il prefisso `v` resta tollerato), `README.md`, `CHANGELOG.md`.
**Verifica:** `npm run typecheck` e `npm run build` senza errori, nessuno script di test; regex del workflow provata in bash su `1.2.3` (accettato), `v1.2.3`, `1.2` e `1.2.3-rc` (scartati). Il workflow non è stato eseguito con un tag.
**Note:** nessun tag creato; resta da scrivere la regola su quando e come crearlo in `CLAUDE.md`.

### Lavori dell'11/11 portati su `main`

**Perché:** i lavori dell'11/11 (wiki License Manager, bump della versione in CI, versione dal tag, home a quattro colonne) erano solo in locale; vanno su `main` per pubblicare il sito e avviare il bump in CI.
**Cosa:** tre commit (`docs(sagreeventi)`, `docs(license-management)`, `feat(site)`) uniti su `develop` con squash (PR #50). `main` aveva sei commit di squash precedenti che `develop` non conteneva, quindi una PR diretta rischiava conflitti `add/add`: prima un merge commit di `main` in `develop` (PR #51, nessuna modifica ai file), poi `develop` su `main` con merge commit (PR #52). Il merge su `main` ha oggetto `merge: ...`, quindi il bump in CI non cambia la versione (resta 0.6.0). Nel `README.md` la frase «vale il titolo della PR» ora vale solo per lo squash su `develop`: su `main` conta l'oggetto del merge commit.
**Dove:** `README.md` (sezione «Versionamento»), `CHANGELOG.md`.
**Verifica:** `npm run typecheck` e `npm run build` senza errori prima dei commit (nessuno script di test); controllo visivo della home fatto dall'utente. Il workflow su `main` è concluso con esito positivo (riferito dall'utente); nessun commit `chore(version)`, come atteso con l'oggetto `merge: ...`. Il ramo con bump effettivo non è ancora provato.
**Note:** da decidere come far scattare il bump con i merge commit su `main` (oggetto scritto a mano o bump calcolato sui commit del merge); poi deciso: oggetto `feat(...)` o `fix(...)` scritto a mano, regola in `CLAUDE.md`.

## 2026-11-12

### SagreEventi: layout della scheda «Temi»

**Perché:** nel repository applicativo la scheda Gestione → Temi affianca ora i periodi a due a due (fix `bugfix/temi-layout`, non ancora committato); la pagina descriveva una scheda per riga.
**Cosa:** una frase nella sezione «Scheda "Temi"» sulla disposizione (due colonne da 768 px, una sul telefono; Inizio sopra Fine, Giorno e Mese sulla stessa riga).
**Dove:** `docs/sagreeventi/temi.md`, `CHANGELOG.md`.
**Verifica:** solo testo; `typecheck` e `build` della wiki non rieseguiti.

### SagreEventi: pagina sui temi e periodi stagionali

**Perché:** i periodi dei temi stagionali ora si leggono dal server e l'Admin li cambia da Gestione → Temi (PR #58 del repository applicativo); le pagine non parlavano dei temi.
**Cosa:** nuova pagina «Temi» (temi disponibili, periodi iniziali, come si sceglie il tema, scheda Admin, endpoint e validazione, cache, rilascio); riga di `/api/temi/periodi` in `api.md`.
**Dove:** `docs/sagreeventi/temi.md`, `docs/sagreeventi/api.md`, `CHANGELOG.md`.
**Verifica:** `npm run typecheck` e `npm run build` senza errori (link validati con `onBrokenLinks: 'throw'`); l'unico avviso è la data di aggiornamento non inferibile per la pagina nuova, non ancora tracciata da git. Contenuto confrontato con `theme.service.ts`, `PeriodoTemaValidator` e `TemiEndpoints` del repository applicativo.

### SagreEventi: il tag di rilascio è `X.Y.Z`, senza `v`

**Perché:** `git.md` 1.5 vuole tag `X.Y.Z` senza prefisso; la CI di SagreEventi è stata allineata e le pagine parlavano ancora di `vX.Y.Z`.
**Cosa / Dove:** `docs/sagreeventi/architettura.md`, `deployment.md`, `informazioni.md`.
**Verifica:** solo testo Markdown, build del sito non eseguita.

### Regole su tag e rilasci del plugin kit 1.12.0

**Perché:** il plugin `kit` 1.12.0 blocca i tag con nome o branch sbagliati e `git.md` 1.5 definisce formato e momento del tag; la pagina del plugin parlava ancora di tag sempre consentiti.
**Cosa:** in `plugin.md` la frase sul blocco dei comandi e la sezione «Integrazione GitHub» descrivono la regola (tag `X.Y.Z` senza `v`, solo da `main`, via dell'utente come regola scritta); aggiunta la nota di aggiornamento alla 1.12.0.
**Dove:** `docs/claude-config/plugin.md`, `CHANGELOG.md`.
**Verifica:** build del sito non eseguita per questa modifica (solo testo Markdown).

## 2026-11-11

### Bump della versione in CI

**Perché:** la versione restava a 0.6.0: il bump locale (hook `post-commit`) scatta solo per `feat`/`fix`/`perf`, i commit recenti sono `docs`/`chore`, le PR sono unite con squash su GitHub dove l'hook non gira, e non ci sono tag. Richiesta dell'utente di spostare il bump in CI.
**Cosa:** a ogni push su `main` il workflow calcola la versione dal messaggio del commit (stessa regola di prima: `feat` minor, `fix`/`perf` patch, breaking major, `docs`/`chore` nessun cambio), la scrive in `VERSION` e `package.json` prima del build, così il footer dell'immagine mostra già il numero nuovo, e a build riuscito registra `chore(version): x.y.z` su `main`. Il push con `GITHUB_TOKEN` non riavvia il workflow. `bump-version.mjs` ha la nuova opzione `--no-commit`. Rimossi l'hook locale `post-commit`, `install-git-hooks.mjs` e il `postinstall`. Su `main` un run non viene più annullato da uno successivo.
**Dove:** `.github/workflows/build-push.yml`, `scripts/bump-version.mjs`, `package.json`, `README.md`, `CHANGELOG.md`; eliminati `.githooks/post-commit` e `scripts/install-git-hooks.mjs`.
**Verifica:** `--dry-run` su `docs`, `fix` e `feat!` (nessun cambio, 0.6.1, 1.0.0); `--no-commit` provato e file ripristinati; `npm run typecheck` e `npm run build` senza errori; nessuno script di test; Grep di `Disco_E` e `C:\Users` in `docs/` senza risultati. Il workflow non è stato eseguito su GitHub.
**Note:** il tag `vX.Y.Z` resta possibile e ha la precedenza sul footer (vedi sotto).

### Versione dal tag di rilascio

**Perché:** la versione nel footer veniva solo da `VERSION`, aggiornato dal bump dopo ogni commit; richiesta dell'utente di ricavarla anche dal tag di rilascio, come per SagreEventi. Il bump esistente resta.
**Cosa:** con il tag `vX.Y.Z` la CI passa `APP_VERSION=X.Y.Z` al build; il footer usa quel valore, altrimenti `VERSION`. Un valore non `X.Y.Z` è scartato. Il workflow parte anche sui tag `vX.Y.Z` e pubblica l'immagine con il tag `X.Y.Z` oltre a `latest` e allo SHA.
**Dove:** `docusaurus.config.ts`, `Dockerfile`, `.github/workflows/build-push.yml`, `README.md`, `CHANGELOG.md`.
**Verifica:** vedi sotto (typecheck e build, anche con `APP_VERSION`).
**Note:** il tag non è stato creato: i tag richiedono l'approvazione dell'utente. Il workflow non è stato eseguito su GitHub.

### Home a quattro colonne

**Perché:** con quattro aree, due colonne lasciavano la home lunga e le card molto grandi; richiesta dell'utente di passare a 3 o 4 colonne.
**Cosa:** le card passano da `col--6` a `col--3` (4 colonne sopra 996px); tra 577px e 996px restano 2 colonne, sotto 1 colonna. Le copertine si ridimensionano da sole (larghezza 100%, proporzioni 3:1), nessuna immagine modificata.
**Dove:** `src/pages/index.tsx`, `src/css/custom.css`, `CHANGELOG.md`.
**Verifica:** vedi sotto (typecheck e build).

### Nuova wiki License Manager

**Perché:** documentare il servizio di gestione delle licenze delle web app SaaS (progetto `license-manager`), come già fatto per Sagre & Eventi e per il kit.
**Cosa:** nuova wiki con sette pagine (introduzione, architettura, sicurezza, configurazione, API di validazione, API di gestione, sviluppo) che descrivono lo stato del backend dopo il passo 6b (prodotti, piani, account e membri); registrata in `src/data/wikis.ts` con sidebar e copertina; titolo, descrizione e README aggiornati; sezione dedicata in `CLAUDE.md`.
**Dove:** `docs/license-management/`, `sidebars/license-management.ts`, `static/img/home-license.svg`, `src/data/wikis.ts`, `docusaurus.config.ts`, `README.md`, `CLAUDE.md`, `CHANGELOG.md`.
**Verifica:** vedi la voce di verifica sotto (typecheck e build).

### Chiusura dei punti aperti del piano

**Perché:** restavano due passi in `PIANO.md`: la verifica di `mappa.md`, delle pagine sul frontend e della versione dal tag, e la scelta del `sidebar_position` di `mappa.md`.
**Cosa:** verifica chiusa per decisione dell'utente sul codice non committato: nei worktree locali ci sono le cartelle per elemento di `core/`, `shared/` e `features/`, `build-info.generated.ts`, `APP_VERSION` in `build-push.yml` e `build-info.mjs`, e la mappa e `geocoding.service.ts` in `sagreeventi-gps`; su `develop` del repository applicativo ancora no. `sidebar_position: 12` di `mappa.md` confermato dall'utente.
**Dove:** `PIANO.md`, `CHECKLIST.md` (poi eliminati, vedi sotto), `CHANGELOG.md`.
**Verifica:** nessun file toccato in `docs/`: typecheck e build restano quelli del 2026-11-11, senza errori.
**Note:** il controllo va ripetuto al merge nel repository applicativo: `mappa.md`, le pagine sul frontend (`architettura.md`, `informazioni.md`, `sviluppo.md`) e la versione dal tag (`APP_VERSION`). Con l'eliminazione di `CHECKLIST.md` il promemoria resta solo qui.

### Eliminazione di `PIANO.md` e `CHECKLIST.md`

**Perché:** il piano è concluso (nessun passo né decisione aperta) e l'utente ha chiesto di togliere i file di lavoro.
**Cosa:** eliminati `PIANO.md` e `CHECKLIST.md`; `CLAUDE.md` continua a rimandare a `CHECKLIST.md` per le annotazioni future, che si ricrea al bisogno. Branch locali già ridotti a `develop` e `main`.
**Dove:** `PIANO.md`, `CHECKLIST.md`, `CHANGELOG.md`.
**Verifica:** nessun file di `docs/` toccato: typecheck e build restano quelli del 2026-11-11, senza errori.

### Pulizia dei branch e aggiornamento di PIANO e CHECKLIST

**Perché:** le PR #40, #42 e #44 sono unite in `develop` (la #44 è proprio l'aggiornamento di questi file); i file di lavoro dovevano riflettere lo stato reale.
**Cosa:** cancellati i branch locali `feature/sagreeventi-mappa-frontend`, `bugfix/claude-md-gh-cli` e `bugfix/piano-checklist-aggiornamento`; `develop` e `main` portati in fast-forward a `origin`. Controllati i punti aperti nel repository applicativo: su `develop` non ci sono ancora mappa, refactoring P1–P4 né `APP_VERSION`, quindi `mappa.md` e le pagine sul frontend restano da verificare. `sidebar_position: 12` di `mappa.md` non ha conflitti.
**Dove:** `PIANO.md`, `CHECKLIST.md`, `CHANGELOG.md`.
**Verifica:** `git branch -vv` mostra `develop` e `main` allineati a `origin`; nessun file toccato in `docs/`, quindi typecheck e build restano quelli del 2026-11-11 senza errori.
**Note:** i branch remoti `bugfix/claude-md-gh-cli` e `bugfix/piano-checklist-aggiornamento` sono stati poi cancellati dall'utente: su `origin` restano solo `develop` e `main`.

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
