# CHECKLIST

Problemi trovati lavorando, da risolvere.

- [ ] `docs/sagreeventi/mappa.md` descrive il codice di `feature/gps-eventi`, non ancora unito a `develop`: va verificata al merge.
- [ ] Le pagine sul frontend (`architettura.md`, `informazioni.md`, `sviluppo.md`) descrivono il refactoring P1–P4 non ancora committato nel repository applicativo: va verificato al commit.
- [x] Il PIANO del 2026-11-10 elencava modifiche non committate in `docs/claude-config/{contenuto,funzionamento,intro}.md`: erano già su `develop` (#38), il piano era superato. Anche `plugin.md` (esempio JSON) è già su `develop`.
- [x] `npm run typecheck` e `npm run build` rieseguiti il 2026-11-11 sullo stato attuale: senza errori.
- [x] Branch remoto `bugfix/claude-config-docs-allineamento`: cancellato dall'utente (`git ls-remote --heads origin` non lo mostra più, 2026-11-11).
