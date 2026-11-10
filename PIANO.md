# PIANO

Piano di lavoro sulla wiki unificata (`docs/claude-config/`, `docs/sagreeventi/`).

## Passi

- [x] Regole della documentazione di SagreEventi in `CLAUDE.md` e creazione di `CHANGELOG.md` (voce 2026-11-09). Verifica: build e typecheck senza errori il 2026-11-11; test: nessuno script di test nel progetto
- [x] Pagina `docs/sagreeventi/mappa.md` e righe `mappa.*` in `configurazione.md` e `intro.md`. Verifica: build senza errori né link rotti il 2026-11-11; test: nessuno script di test nel progetto
- [x] Struttura del frontend in `architettura.md`, `informazioni.md`, `sviluppo.md`. Verifica: build senza errori il 2026-11-11; test: nessuno script di test nel progetto
- [x] Eseguire `npm ci --ignore-scripts`, poi `npm run typecheck` e `npm run build`. Verifica: build e typecheck senza errori il 2026-11-11, 0 vulnerabilità; test: nessuno script di test nel progetto
- [x] Percorsi generici: esempio JSON di `docs/claude-config/plugin.md` (già su `develop` con #38) e regola «Percorsi» in `CLAUDE.md`. Verifica: build senza errori il 2026-11-11 e nessuna occorrenza di `Disco_E` e `C:\Users` in `docs/`; test: nessuno script di test nel progetto
- [x] Committare le modifiche di `docs/sagreeventi/` sul branch `feature/sagreeventi-mappa-frontend` da `develop` (ok dell'utente del 2026-11-11). Verifica: build e typecheck senza errori il 2026-11-11; test: nessuno script di test nel progetto
- [ ] Verificare `mappa.md` e le pagine sul frontend quando `feature/gps-eventi` e il refactoring P1–P4 saranno su `develop` del repository applicativo
- [ ] Decidere se tenere `sidebar_position: 12` per `mappa.md` o riordinare le pagine
- [x] Cancellare il branch remoto `bugfix/claude-config-docs-allineamento` (lo ha fatto l'utente). Verifica: `git ls-remote --heads origin` non lo mostra più (2026-11-11); build e typecheck non coinvolti, test: nessuno script di test nel progetto

## Ripartenza

- **Data:** 2026-11-11
- **Passo in corso:** nessuno. Il commit è sul branch `feature/sagreeventi-mappa-frontend`.
- **Ultimo passo completato:** `npm ci --ignore-scripts`, `npm run typecheck` e `npm run build` senza errori; branch locali allineati a `origin` (`main` `6ac0256`, `develop` `88caece`); branch locale del bugfix cancellato.
- **Prossimo passo:** decidere se fare push e aprire la PR verso `develop` (approvati in generale da `CLAUDE.md`, ma si chiede conferma prima).
- **Decisioni aperte:**
  - quando verificare `mappa.md` e le pagine sul frontend, che descrivono codice non ancora unito a `develop` nel repository applicativo;
  - se riordinare il `sidebar_position` di `mappa.md`.
- **File toccati (non committati):** `CHANGELOG.md`, `CLAUDE.md`, `PIANO.md`, `CHECKLIST.md` (nuovi), `docs/sagreeventi/{architettura,configurazione,deployment,informazioni,intro,sviluppo}.md`, `docs/sagreeventi/mappa.md` (nuovo). `docs/claude-config/` non ha modifiche.
- **Test rotti:** nessuno. Typecheck e build del 2026-11-11 senza errori (resta l'avviso sulla data di aggiornamento dei file non tracciati).
- **Commit di oggi:** uno su `feature/sagreeventi-mappa-frontend` (pagine di SagreEventi, `CLAUDE.md`, `CHANGELOG.md`, `PIANO.md`, `CHECKLIST.md`).
