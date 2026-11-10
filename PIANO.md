# PIANO

Piano di lavoro sulla wiki unificata (`docs/claude-config/`, `docs/sagreeventi/`).

## Passi

- [x] Regole della documentazione di SagreEventi in `CLAUDE.md` e creazione di `CHANGELOG.md` (voce 2026-11-09). Verifica: build e typecheck senza errori il 2026-11-11; test: nessuno script di test nel progetto
- [x] Pagina `docs/sagreeventi/mappa.md` e righe `mappa.*` in `configurazione.md` e `intro.md`. Verifica: build senza errori né link rotti il 2026-11-11; test: nessuno script di test nel progetto
- [x] Struttura del frontend in `architettura.md`, `informazioni.md`, `sviluppo.md`. Verifica: build senza errori il 2026-11-11; test: nessuno script di test nel progetto
- [x] Eseguire `npm ci --ignore-scripts`, poi `npm run typecheck` e `npm run build`. Verifica: build e typecheck senza errori il 2026-11-11, 0 vulnerabilità; test: nessuno script di test nel progetto
- [x] Percorsi generici: esempio JSON di `docs/claude-config/plugin.md` (già su `develop` con #38) e regola «Percorsi» in `CLAUDE.md`. Verifica: build senza errori il 2026-11-11 e nessuna occorrenza di `Disco_E` e `C:\Users` in `docs/`; test: nessuno script di test nel progetto
- [x] Committare le modifiche di `docs/sagreeventi/` e unirle in `develop` (PR #40, ok dell'utente del 2026-11-11). Verifica: build e typecheck senza errori il 2026-11-11; test: nessuno script di test nel progetto
- [x] Registrare in `CLAUDE.md` la GitHub CLI installata (PR #42, unita). Verifica: build e typecheck senza errori il 2026-11-11, nessuna occorrenza di `Disco_E` e `C:\Users` in `docs/`; test: nessuno script di test nel progetto
- [ ] Verificare `mappa.md`, le pagine sul frontend e la versione dal tag quando il codice sarà su `develop` del repository applicativo (controllato il 2026-11-11: su `develop` non ci sono ancora mappa, refactoring P1–P4 né `APP_VERSION`; sono modifiche non committate lì)
- [ ] Decidere se tenere `sidebar_position: 12` per `mappa.md` o riordinare le pagine (nessun conflitto: le posizioni 1–12 sono tutte diverse)
- [x] Cancellare il branch remoto `bugfix/claude-config-docs-allineamento` (lo ha fatto l'utente). Verifica: `git ls-remote --heads origin` non lo mostra più (2026-11-11); build e typecheck non coinvolti, test: nessuno script di test nel progetto

## Ripartenza

- **Data:** 2026-11-11
- **Passo in corso:** nessuno. Le PR #40 e #42 sono unite in `develop` (e #41, #43 in `main`).
- **Ultimo passo completato:** pagine di SagreEventi e riga sulla GitHub CLI in `CLAUDE.md` su `develop`; branch locali puliti e allineati a `origin` (`develop` `e3318ae`, `main` `5cec537`).
- **Prossimo passo:** aspettare che mappa, refactoring P1–P4 e versione dal tag arrivino su `develop` del repository applicativo, poi verificare `mappa.md` e le pagine sul frontend.
- **Decisioni aperte:**
  - quando verificare `mappa.md` e le pagine sul frontend, che descrivono codice non ancora unito a `develop` nel repository applicativo;
  - se riordinare il `sidebar_position` di `mappa.md`.
- **File toccati (non committati):** `PIANO.md`, `CHECKLIST.md`, `CHANGELOG.md` (questo aggiornamento di fine giornata).
- **Test rotti:** nessuno. Typecheck e build del 2026-11-11 senza errori.
- **Commit di oggi:** merge delle PR #40 (pagine di SagreEventi) e #42 (riga sulla GitHub CLI) in `develop`.
