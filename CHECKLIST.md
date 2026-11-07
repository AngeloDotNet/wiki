# Checklist: problemi emersi

## Aperti

- [ ] **Stile enciclopedia da verificare nel browser.** Applicato solo con CSS (`src/css/custom.css`): palette blu/crema, titoli serif, footer blu. Non ancora visto. Footer e 404 non sono stati swizzlati (sono "Safe"): le loro modifiche sono solo CSS; decidere se servono copie locali.

- [ ] **Pagina 404 da verificare nel browser.** Immagine `static/img/404.svg` sopra il titolo, copiata con l'eject di `NotFound` (in `src/theme/NotFound/`). Verificato solo il file HTML del build. Il testo viene dalle traduzioni italiane di Docusaurus.

- [ ] **Card della homepage da verificare nel browser.** Due card Infima con copertina SVG in cima (`static/img/home-claude-kit.svg`, `static/img/home-sagre.svg`), titolo, testo e pulsante in fondo (`src/pages/index.tsx`, stili in `src/css/custom.css`). Verificato solo l'HTML del build. Le copertine sono illustrazioni più dettagliate, non ancora viste nel browser. La pagina MudBlazor di riferimento non si è letta: la struttura è quella nota della libreria.

- [ ] **Wiki più complete da verificare nel browser.** Ricerca locale (`@easyops-cn/docusaurus-search-local` 0.55.3, indice con pagine di entrambe le wiki), link "Modifica questa pagina" su `develop`, metadati di descrizione, data di ultimo aggiornamento solo con git. Verificato solo l'HTML del build.

- [ ] **Immagine social per le condivisioni non decisa.** I social non mostrano SVG: serve un PNG o JPG, che non posso generare qui. Finché manca, nessun `og:image`.

- [ ] **Data di ultimo aggiornamento nel build Docker da verificare.** La condizione `existsSync('.git')` dovrebbe nascondere la data nel container, perché `.dockerignore` esclude `.git`. Non provato: Docker non è installato.

- [ ] **Test di login sul sito, da provare su una macchina con Docker.** `nginx/default.conf` ha `auth_basic` sull'intero sito. Rischio: senza il file `/etc/nginx/auth/.htpasswd` montato, nginx non parte. Non provato: qui non ci sono nginx né Docker. Il file `htpasswd` si genera sul server con `scripts/make-htpasswd.sh` (formato verificato, server non verificato). Per tornare alla versione attuale: vedi PIANO.md, sezione "Test: login".

- [ ] **Compose sul server da aggiornare a mano.** Serve aggiungere `volumes: - /etc/wiki/htpasswd:/etc/nginx/auth/.htpasswd:ro` al servizio `wiki-projects`, come scritto nel README. Il compose sul server non è nel repository e non l'ho modificato. Prima del `docker compose up` va generato `htpasswd`, perché con `restart: always` il container entra in ciclo di riavvio.

- [ ] **Colore fuori palette nelle copertine.** La copertina Sagre usa il dorato `#d9a441` per le luci. Decidere se tenerlo come token del sito o sostituirlo con un colore della palette.

- [ ] **Componenti "Unsafe" non copiati.** Navbar, Layout, DocItem e DocBreadcrumbs restano del tema classico, per scelta dell'utente (vedi PIANO.md).

- [ ] **Da riportare nella documentazione:** i visitatori contattano `raw.githubusercontent.com` quando vedono un blocco `reference`.

- [ ] **Plugin codeblock: ultima modifica nel gennaio 2024, nessuna peer dependency dichiarata.** Il caricamento nel browser è verificato (vedi Risolti), ma il pacchetto non è mantenuto: se serve, valutare alternative o fork.

- [ ] **Commit non fatti.** Modifiche non committate: `docusaurus.config.ts`, `package.json`, `package-lock.json`, `static/img/favicon.svg`, più i file nuovi `README.md`, `PIANO.md`, `CHECKLIST.md`. Decidere branch e messaggio prima di committare.

- [ ] **Build Docker non verificato.** `docker` non è installato nell'ambiente di sviluppo: `docker build` va eseguito su una macchina con Docker.

- [ ] **Tipizzazione del config ridotta.** Con la rimozione del preset è caduto `satisfies Preset.ThemeConfig`: `themeConfig` è ora tipizzato solo dal `Config` generico di `@docusaurus/types`. Un errore nelle opzioni del tema non viene più segnalato a compile time.

## Risolti

- [x] Favicon nuova (libro aperto) visibile nel browser, verificata dall'utente.
- [x] Blocchi `reference` in produzione: la CSP ora consente `raw.githubusercontent.com` in `connect-src`. Verificato nel browser con `npm run serve`: il codice del plugin compare (non "loading...").

- [x] Errore di typecheck su `src/pages/index.tsx` (`title` non riconosciuto dopo la rimozione del preset): i tipi di `theme-classic` sono ora referenziati esplicitamente in `docusaurus.config.ts`.
