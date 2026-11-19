# Checklist

Problemi aperti trovati lavorando sulla wiki. Le voci chiuse si cancellano.

- [ ] **Impostazioni del kit non allineate:** nel file `kit-progetti.json` la voce del repository PersonalIdp ha `sito.esiste: false`, ma ora la wiki esiste. Aggiornarla (per esempio con `/kit:aggiorna-docs` lanciato in quel progetto).
- [ ] **Pagine PersonalIdp e console non ancora su `develop` (2026-11-19):** il backend con permessi, sessioni e API admin è su `develop` (PR #23). Restano da committare la console `admin-ui/` e la documentazione del repository `PersonalIdp`. Quando saranno su `develop`, verificare che le pagine corrispondano al codice.
- [ ] **Repository PersonalIdp:** il `CLAUDE.md` ha una riga nuova (aggiornare la wiki a ogni cambio di comportamento), non committata insieme alle altre modifiche del branch di lavoro.
