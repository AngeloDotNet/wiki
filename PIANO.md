# Piano: sostituzione del preset Docusaurus

## Obiettivo

Togliere `@docusaurus/preset-classic` dal `docusaurus.config.ts` e dichiarare a mano i plugin e il tema che il preset fornisce oggi, aggiungendo il plugin `docusaurus-theme-github-codeblock`. Il sito deve restare identico, salvo il nuovo supporto ai blocchi di codice da GitHub.

## Conclusioni dell'analisi

- Il preset è solo un pacchetto che dichiara plugin e temi. Le due wiki sono già dichiarate direttamente con `@docusaurus/plugin-content-docs`, con `docs: false` e `blog: false` nel preset.
- Il preset fornisce oggi: `plugin-content-pages` (serve per `src/pages/index.tsx`), `plugin-sitemap` (genera `sitemap.xml`), `theme-classic` (Layout, navbar, footer, colorMode, Prism, 404, `customCss`), `plugin-css-cascade-layers` (serve al flag `future.v4.useCssCascadeLayers`), più `plugin-debug`, `plugin-svgr`, gtag, GTM, Google Analytics, blog e Algolia, che il progetto non usa.
- Il tema non si sostituisce: nessun tema della community è un sostituto affidabile (vedi la conversazione). Si resta con `theme-classic`.
- `docusaurus-theme-github-codeblock` (MIT, v2.0.2, dipendenza `@docusaurus/types ^3`) si aggiunge alla lista `themes` accanto a `theme-classic`. Scarica il codice dai riferimenti GitHub solo quando un blocco usa `reference`: la configurazione da sola non fa richieste di rete. Non è stato ancora provato con Docusaurus 3.10.2.
- I tipi `Preset.Options` e `Preset.ThemeConfig` in `docusaurus.config.ts` vanno sostituiti con quelli di `theme-classic`.

## Passi

1. Baseline: `npm ci` e `npm run build` sullo stato attuale; salvare l'elenco delle route e il `sitemap.xml` come riferimento.
2. Rimuovere `@docusaurus/preset-classic` dalle dipendenze.
3. Installare con versione esatta `@docusaurus/theme-classic`, `@docusaurus/plugin-content-pages`, `@docusaurus/plugin-sitemap`, `@docusaurus/plugin-css-cascade-layers` (tutte 3.10.2) e `docusaurus-theme-github-codeblock` (2.0.2).
4. In `docusaurus.config.ts`: eliminare il blocco `presets`; aggiungere `themes` con `theme-classic` (opzione `customCss: './src/css/custom.css'`) e `docusaurus-theme-github-codeblock`; aggiungere i plugin `content-pages`, `sitemap` e `css-cascade-layers`; aggiungere `themeConfig.codeblock` con valori di default; sostituire i tipi.
5. Verificare la licenza dei pacchetti aggiunti (`core.md` §3).
6. `npm run typecheck`, `npm run build`, confronto con la baseline (route, sitemap, CSS caricato), `node scripts/generate-csp.mjs`.
7. Provare un blocco `reference` su una pagina di prova solo localmente, senza committarlo, per confermare che il plugin funziona con Docusaurus 3.10.2. Se non funziona, annotare in `CHECKLIST.md` e decidere con l'utente se tenerlo.
8. Build Docker (`docker build`) se disponibile.

## Favicon (secondo piano)

- Attuale: `static/img/favicon.svg`, un prompt da terminale (`>_`), non adatto a una wiki.
- Scelta dell'utente: libro aperto (bozza `favicon-a-libro.svg`, fuori dal repository).
- Il logo di Wikipedia è un marchio della Wikimedia Foundation: non viene copiato.
- Passi: sostituire `static/img/favicon.svg` con la bozza scelta; verificare che `docusaurus.config.ts` (`favicon: 'img/favicon.svg'`) resti valido; rifare il build e controllare `build/img/favicon.svg`.
- Nessun altro file cambia.

## CSP per il plugin codeblock (terzo piano)

- Problema: il plugin scarica il codice dei blocchi `reference` dal browser da `raw.githubusercontent.com`; la CSP ha `connect-src 'self'`, quindi in produzione i blocchi restano su "loading...".
- Decisione dell'utente: aprire la CSP solo a `https://raw.githubusercontent.com` in `connect-src`, come deroga di sicurezza da registrare.
- Passi: modificare `connect-src` in `scripts/generate-csp.mjs` con un commento che spiega la deroga; rigenerare `.generated/csp.conf` e verificare che la direttiva contenga l'host; rifare il build; provare un blocco `reference` in locale (pagina temporanea da eliminare) e verificare che il codice venga caricato invece di "loading...".
- Conseguenza: i visitatori contattano `raw.githubusercontent.com` quando vedono un blocco `reference`. Da riportare nella documentazione.

## Tema custom con swizzle selettivo (quarto piano, in attesa di decisioni)

- Approccio scelto: swizzle selettivo di `@docusaurus/theme-classic`. I componenti copiati in `src/theme/` sostituiscono quelli del tema classico, il resto resta invariato.
- Aree scelte dall'utente: navbar e footer; pagine di documento (DocItem, DocSidebar, DocBreadcrumbs); colori e font (CSS in `src/css/custom.css`); home e 404 (Layout, NotFound).
- Costo: ogni componente copiato va riallineato quando si aggiorna `@docusaurus/theme-classic`. Il tema classico conta circa 210 file in `src/theme`.
- Verifica dello swizzle (`npx docusaurus swizzle @docusaurus/theme-classic --list --typescript`): Footer, NotFound, SearchBar e DocSidebar (wrap) sono "Safe". Navbar, Layout, DocItem, DocBreadcrumbs, DocSidebar/Desktop e Mobile sono "Unsafe": Docusaurus non ne garantisce la compatibilità tra versioni. DocItem/TOC è "Forbidden".
- Conseguenza: per navbar e pagine di documento la via sicura è CSS (variabili Infima in `src/css/custom.css`), non lo swizzle. Lo swizzle "Unsafe" va fatto solo se l'utente lo accetta esplicitamente.
- Direzione visiva scelta dall'utente: stile enciclopedia (sfondo chiaro, titoli serif, blu scuro come accento). Non si copiano il logo né i colori di Wikipedia.
- Passi previsti dopo la decisione: swizzle dei componenti necessari, modifica secondo la direzione scelta, typecheck, build, confronto visivo con `npm run serve`. Nessun commit senza richiesta.

## Immagine sulla pagina 404 (quinto piano)

- Scelta dell'utente: disegno SVG creato nel progetto, un libro aperto con una pagina mancante, nello stile della favicon.
- Componente: `NotFound/Content` (stato "Safe" nello swizzle). Si copia con eject in `src/theme/NotFound/Content/`, poi si aggiunge l'immagine sopra il titolo "Pagina non trovata".
- Immagine: `static/img/404.svg`, un solo file, nessuna licenza esterna.
- Dimensione: proporzionata, larghezza massima circa 240 px, centrata, via CSS in `src/css/custom.css` con token su `:root`.
- CSP: `img-src 'self' data:` consente l'SVG locale: nessuna modifica alla CSP.
- Verifica: typecheck, build, e controllo nel browser su una pagina inesistente (`npm run serve`).

## Footer su due righe (sesto piano)

- Testo in `docusaurus.config.ts`, campo `themeConfig.footer.copyright`. Il tema lo inserisce come HTML (`dangerouslySetInnerHTML`), quindi un `<br />` va a capo.
- Scelta: a capo dopo "Angelo Pirola.", così la riga 1 è il copyright e la riga 2 "Realizzato con Docusaurus. Versione x.y.z.".
- Verifica: build e controllo di `build/index.html`.

## Card della homepage (settimo piano)

- Scelta dell'utente: card sobria con icona piccola sopra il titolo e pulsante "Apri" in fondo.
- File: `src/pages/index.tsx` (pagina nostra, nessuno swizzle). Icone come SVG inline con `currentColor`, nessun file esterno.
- Stile: classi Infima `card`, `card__header`, `card__body`, `card__footer`; altezza uniforme con flex; bordo e ombra come token su `:root` in `src/css/custom.css`, con variante scura.
- Verifica: typecheck, build, controllo nel browser su `npm run serve`.

## Card con copertina (ottavo piano)

- Riferimento: card "Media" di MudBlazor (copertina in alto, titolo e testo al centro, azioni in basso). La pagina di riferimento non si è letta: la struttura è quella nota della libreria.
- Scelta dell'utente: banner SVG per entrambe le card, creati nel progetto.
- File: `static/img/home-claude-kit.svg` e `static/img/home-sagre.svg`, proporzione 3:1, colori dalla palette del sito.
- `src/pages/index.tsx`: copertina `<img>` in cima alla card (`useBaseUrl`), poi titolo e testo, pulsante in fondo. Le icone SVG della versione precedente si tolgono, perché la copertina le sostituisce.
- CSS: copertina a larghezza piena con altezza automatica, angoli arrotondati in alto; token già in `:root` per bordo e ombra.
- Verifica: typecheck, build, controllo nel browser.

## Elenco unico delle wiki (nono piano)

- Scelta dell'utente: un solo elenco, letto da homepage e navbar, così aggiungere una wiki significa aggiungere una voce.
- File nuovo: `src/data/wikis.ts`, con id, titolo, descrizione, cartella docs, percorso di partenza, file della sidebar, nome della sidebar, copertina. Nessuna dipendenza da React: può essere letto anche dal config Node.
- `docusaurus.config.ts`: i plugin `plugin-content-docs` e le voci della navbar si generano dall'elenco. Le altre impostazioni non cambiano.
- `src/pages/index.tsx`: le card si generano dall'elenco.
- Invariato: il contenuto delle sidebar in `sidebars/` e le pagine in `docs/`.
- Verifica: typecheck, build, confronto con la baseline delle route e della navbar (stesse due wiki, stessi percorsi).

## Copertine più curate (decimo piano)

- Scelta dell'utente: illustrazione piatta dettagliata, sempre SVG, 600 × 200 come ora.
- Claude Code Kit: finestra di terminale con righe di codice e cursore, sopra fondo blu scuro della palette.
- Sagre & Eventi: scena con tenda, luci appese, bandierine e calendario, su fondo crema della palette. Per le luci serve un accento caldo: un solo colore fuori palette, dichiarato come token.
- Nessun cambio a `src/pages/index.tsx` né a `src/data/wikis.ts`: stessi nomi di file.
- Verifica: typecheck, build, controllo visivo nel browser.

## Completare la wiki (undicesimo piano)

Scelte dell'utente: ricerca nel sito, link "Modifica questa pagina", metadati SEO e social, data di ultimo aggiornamento.

Analisi:
- Ricerca: nessun plugin di ricerca oggi (verificato in config e package.json). Scelta: `@easyops-cn/docusaurus-search-local` 0.55.3, MIT, peer Docusaurus `^2 || ^3`. Dichiara anche `open-ask-ai` tra le peer: va verificato che sia opzionale e non trascini dipendenze inutili. Indice locale, nessuna richiesta esterna (compatibile con la CSP).
- Link "Modifica": repository `https://github.com/AngeloDotNet/wiki` (remote di origin). Opzione `editUrl` per ciascuna istanza docs. Da verificare come viene composto il percorso: le cartelle sono `docs/claude-config` e `docs/sagreeventi`, dentro questo repo.
- Metadati: `description` e titolo di default nel config. Anteprima social (`image` in themeConfig): i social non mostrano SVG, serve un PNG o JPG. Non si genera PNG senza strumenti: va deciso.
- Data di ultimo aggiornamento: richiede git. Il `.dockerignore` esclude `.git`, quindi nel build Docker la data mancherebbe. Da verificare il comportamento di Docusaurus senza git; non si cambia `.dockerignore` senza decisione.

Decisioni aperte (da chiedere uno alla volta):
1. Immagine di anteprima social: PNG fornito dall'utente, oppure nessuna immagine per ora.
2. Data di ultimo aggiornamento nel build Docker: se manca, accettare il comportamento senza data oppure includere `.git` nel build.
3. Branch per il link "Modifica": `main` (branch predefinito) oppure `develop` (branch di lavoro corrente).

Decisioni prese:
- Branch del link "Modifica": `develop` (scelta dell'utente).
- Data di ultimo aggiornamento: solo dove git è disponibile. Nel config `showLastUpdateTime` vale `true` se esiste `.git` nella root (locale sì, container no). Così nel build Docker la data non compare, invece della data del build.
- Immagine social: ancora da decidere.

Passi (dopo le decisioni):
1. Installare la ricerca con versione esatta, aggiungerla a `themes`, verificare che l'indice dei due wiki venga creato e che la ricerca trovi pagine in entrambi.
2. `editUrl` per ciascuna istanza docs (da elenco `src/data/wikis.ts` se possibile).
3. Metadati: descrizione e titolo di default nel config.
4. `showLastUpdateTime` secondo la decisione 2.
5. Typecheck, build, confronto route con la baseline, verifica nel browser.

## Test: login sull'intero sito (dodicesimo piano, reversibile)

Analisi:
- Un sito statico non può nascondere contenuti con un login nel browser: i file sono pubblici. La protezione va fatta sul server, con l'autenticazione base di nginx (`auth_basic`).
- Il repository è già pubblico su GitHub, e l'immagine Docker finisce su Docker Hub: il login protegge solo il sito servito, non il sorgente.
- Le credenziali non si leggono dal `.env` da nginx: serve un file `htpasswd` generato da quelle variabili. Il file non va nel repository né nell'immagine.
- Nessun nginx né Docker qui: il comportamento reale va provato su una macchina con Docker. Qui si può solo controllare la sintassi, se disponibile.

Modifiche del test:
1. `nginx/default.conf`: `auth_basic` e `auth_basic_user_file /etc/nginx/auth/.htpasswd` nel blocco `server`.
2. `.gitignore` e `.dockerignore`: escludere `htpasswd` e `.htpasswd`.
3. Il file `htpasswd` monta da fuori dell'immagine, sul server.

Backup prima del test (per tornare indietro): `scratchpad/backup-prima-login/` contiene `nginx/default.conf`, `docusaurus.config.ts`, `Dockerfile`, `.gitignore`, `.dockerignore`.

Ritorno alla versione attuale (decisione dell'utente: togliere login e link):
- ripristinare `nginx/default.conf`, `.gitignore`, `.dockerignore` dal backup;
- rimuovere da `docusaurus.config.ts` la riga `editUrl` (il link "Modifica questa pagina");
- la data di ultimo aggiornamento resta.

Decisione presa: `scripts/make-htpasswd.sh <.env> <output>`, eseguito sul server prima del deploy. Legge `WIKI_USER` e `WIKI_PASSWORD`, scrive `user:hash` in formato apr1 con permessi 600. Provato con un `.env` di prova nello scratchpad: formato corretto, password verificata, errori gestiti.

Il file `htpasswd` va montato in `/etc/nginx/auth/.htpasswd`: senza, nginx non parte.

## Ritorno: via login e link "Modifica" (tredicesimo piano)

Decisione dell'utente: togliere il login su tutto il sito e il link "Modifica questa pagina"; resta la data di ultimo aggiornamento.

Analisi: il login con `auth_basic` in `nginx/default.conf` bloccava tutto il sito; il link `editUrl` in `docusaurus.config.ts` è la voce da togliere. Un login che mostra solo il tasto non è stato scelto perché non protegge nulla (il sorgente è pubblico su GitHub).

Passi:
1. `nginx/default.conf`: tolte le direttive `auth_basic` e `auth_basic_user_file`.
2. `docusaurus.config.ts`: tolta la riga `editUrl`; `showLastUpdateTime` resta.
3. Restano invariati: script `make-htpasswd.sh`, `.env.example` e le esclusioni di `htpasswd` in `.gitignore` e `.dockerignore`. Non servono più al sito, ma non fanno danni. Da decidere se rimuoverli.
4. Il volume `htpasswd` nel compose del server è ora inutile: il file è ignorato da nginx. Si può togliere.
5. Verifica: typecheck, build, controllo che `build/` non contenga più il link `edit/`.
6. Commit su un branch nuovo da develop, PR verso develop.

Nota: il 500 segnalato dall'utente va diagnosticato con i log del container e del reverse proxy: potrebbe sparire con il ritorno, ma non è dimostrato.

## Fuori dal piano

- Nessun commit, push o PR senza richiesta esplicita.
- Nessuna modifica al tema o ai componenti `@theme/*`.
- Nessuna modifica ai contenuti in `docs/`.
