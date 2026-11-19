# Checklist

Problemi aperti trovati lavorando sulla wiki. Le voci chiuse si cancellano.

- [ ] **Controllo visivo non eseguito (2026-11-18):** aprire la home con `npm run start` e verificare le tre card con filigrana "WORK IN PROGRESS" (License Manager, Sagre & Eventi, Identity Provider): leggibilità, opacità 0,35 e posizione della scritta sull'illustrazione.
- [ ] **Crash della pagina introduzione di Identity Provider, causa non confermata (2026-11-18):** in sviluppo la pagina `/personal-idp/intro` mostrava `Cannot read properties of undefined (reading 'id')` in `<DocItem>`. Il build di produzione passava. Dopo `npm run clear` e riavvio non è stato verificato nel browser. Se ricompare: raccogliere lo stack trace, controllare la cache di sviluppo e il fatto che la cartella `docs/personal-idp/` non era ancora tracciata da git.
- [ ] **Prima frase di `docs/personal-idp/intro.md`:** dice "Identity Provider è un identity provider", mentre la card dice "Personal Identity provider". Decidere se allinearle.
- [ ] **Modifiche non committate:** wiki Identity Provider (pagine, sidebar, cover, `wikis.ts`, `README.md`, `CLAUDE.md`, `CHANGELOG.md`) ancora su `develop`. Servono branch `feature/…`, commit e PR verso `develop`, su conferma esplicita.
- [ ] **Impostazioni del kit non allineate:** nel file `kit-progetti.json` la voce del repository PersonalIdp ha `sito.esiste: false`, ma ora la wiki esiste. Aggiornarla (per esempio con `/kit:aggiorna-docs` lanciato in quel progetto).
- [ ] **Pagine PersonalIdp e lavoro non committato (2026-11-19):** le pagine descrivono anche console, permessi e sessioni, ancora non committati nel repository `PersonalIdp`. Dopo la commit, verificare che le pagine corrispondano al codice committato e correggere quello che manca o cambia.
- [ ] **Repository PersonalIdp:** il `CLAUDE.md` ha una riga nuova (aggiornare la wiki a ogni cambio di comportamento), non committata insieme alle altre modifiche del branch di lavoro.
