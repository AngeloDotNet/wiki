# Checklist: problemi emersi

## Aperti (da confermare o decidere)

- [ ] **Data di ultimo aggiornamento nel container.** Implementata: il workflow scrive le date nel front matter (`scripts/inject-last-update.mjs`, `fetch-depth: 0`). Verificato in un worktree senza `.git`: la data compare. Da verificare dopo il merge: la pagina online deve mostrare la data.

- [ ] **Colore fuori palette nelle copertine.** La copertina Sagre usa il dorato `#d9a441` per le luci. Decidere se tenerlo come token del sito o sostituirlo con un colore della palette.

- [ ] **Plugin codeblock non mantenuto.** Ultima modifica nel gennaio 2024, nessuna peer dependency dichiarata. Funziona nel browser (verificato), ma valutare alternative o fork.

- [ ] **Da riportare nella documentazione:** i visitatori contattano `raw.githubusercontent.com` quando vedono un blocco `reference`.

- [ ] **Tipizzazione del config ridotta.** Dopo la rimozione del preset, `themeConfig` è tipizzato solo dal `Config` generico di `@docusaurus/types`. Accettare o correggere.

## Risolti

- [x] Card della homepage (copertine, titolo, testo, pulsante): verificate nel browser dall'utente.
- [x] Stile enciclopedia (palette, titoli serif, footer): verificato nel browser dall'utente.
- [x] Pagina 404 con immagine sopra il titolo: verificata nel browser dall'utente.
- [x] Ricerca nel sito: verificata nel browser dall'utente.
- [x] Favicon nuova (libro aperto) visibile nel browser, confermata dall'utente.
- [x] Copertine delle card SVG in stile illustrazione: approvate dall'utente.
- [x] Footer su due righe: confermato dall'utente.
- [x] Blocchi `reference` in produzione: la CSP consente `raw.githubusercontent.com`; il codice del plugin compare nel browser.
- [x] Errore di typecheck su `src/pages/index.tsx`: tipi di `theme-classic` referenziati in `docusaurus.config.ts`.
- [x] Build Docker: l'immagine è costruita dal workflow e il server la esegue.
- [x] Login di test sul sito: rimosso (PR #17), con il link "Modifica". Il sito è pubblico e la navigazione anonima funziona.
- [x] Errore 500 dopo il login: non più presente con l'immagine aggiornata, confermato dall'utente.
- [x] Volume `htpasswd` nel compose: non più usato da nginx; può essere tolto dal server.
- [x] Commit e PR: modifiche committate e fuse su `develop` e `main`.
- [x] Immagine social: nessuna per ora, scelta dell'utente. Aggiungere `og:image` quando c'è un PNG o JPG.
- [x] Componenti "Unsafe" non copiati (Navbar, Layout, DocItem, DocBreadcrumbs): scelta dell'utente, vedi PIANO.md.
- [x] Residui del login di test (script `make-htpasswd.sh`, `.env.example`, esclusioni `htpasswd`, `.env` locale e copie di `htpasswd`): rimossi dal repository e dal PC su richiesta dell'utente.
