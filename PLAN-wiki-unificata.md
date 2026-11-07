# Piano: wiki unificata

> Stato: aperto. Ultimo aggiornamento: 2026-11-06.
> Ruolo di questo repository: **riferimento**. Qui si modifica la documentazione di SagreEventi e di claude-config.

## Contesto

Il sito Docusaurus unico (`docs-unificati`) contiene due istanze di docs: `claude-config` (`docs/claude-config/`) e `sagreeventi` (`docs/sagreeventi/`). Le pagine sono una copia una tantum dei Markdown dei repository originali `claude-config-docs` e `sagreeventi.docs`.

Da ora la fonte è `docs-unificati`: le modifiche alla documentazione si fanno qui, non nei repository originali. Gli originali verranno archiviati su GitHub, dopo i commit dei punti 1 e 2.

## Passi

- [ ] 1. Committare le modifiche non committate delle wiki originali, prima dell'archiviazione. Richiede il via esplicito dell'utente.
  - `claude-config-docs` (branch `develop`): 6 file in `docs/` con modifiche non committate.
  - `sagreeventi.docs` (branch `main`): la cartella `docs/` non è tracciata da Git.
- [ ] 2. Controllare `.github/workflows` di `sagreeventi.docs`. Se c'è una build dell'immagine del sito, archiviando il repository si disattiva.
- [ ] 3. Archiviare i repository originali su GitHub (Settings → Archive this repository). Azione dell'utente.
- [ ] 4. Aggiornare i riferimenti alla wiki vecchia:
  - `CLAUDE.md` di SagreEventi, sezione «Documentazione»;
  - `docs/piani/PLAN-documentazione-sito.md` di SagreEventi;
  - `CLAUDE.md` di `claude-config-docs`.
- [ ] 5. Decidere il dominio definitivo di `docs-unificati` (campo `url` in `docusaurus.config.ts`) e se la home è una pagina di ingresso con le due aree.
- [ ] 6. Per `docs-unificati`:
  - `git init` e remote, a cura dell'utente;
  - `README.md` e `CHANGELOG.md`;
  - deroga documentata per le 5 vulnerabilità basse di `npm audit`, con il fix proposto (downgrade a Docusaurus 3.6.3) che non viene applicato.
- [ ] 7. Quando serve: aggiungere la wiki AppEngine come nuova istanza, senza modificare le altre.

## Ordine

I punti 1 e 2 vanno prima del 3. Il punto 4 si fa dopo l'archiviazione. Il punto 7 non ha vincoli.
