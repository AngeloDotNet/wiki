---
title: Informazioni
sidebar_position: 11
---

# Pagina Informazioni

La pagina **Informazioni** (voce «Informazioni» del menu) descrive in breve l'applicazione e riporta tre blocchi: la licenza (MIT, con il link al file `LICENSE` su GitHub), il link al codice sorgente del repository e la versione dell'applicazione con la data della build.

## Versione e data della build

- **Versione:** il campo `version` di `src/SagreEventi.Web/package.json`, incrementato a mano per ogni rilascio.
- **Data:** la data (giorno, mese e anno, formato italiano) in cui è stata generata la build del client, calcolata nel fuso orario di Roma. Il testo della pagina la chiama «Data di rilascio», ma il valore è la data della build.

Il valore è generato dallo script `src/SagreEventi.Web/scripts/build-info.mjs`, che scrive il file `src/app/core/build-info.generated.ts`. Lo script gira automaticamente prima di `npm run build`, `npm start`, `npm run watch` e dei test (script `pre*` di `package.json`), quindi non serve lanciarlo a mano. Il file generato non è versionato (è nel `.gitignore`) e non va modificato.

Nel client la pagina legge la versione e la data da quel file: per cambiarle basta aggiornare la versione in `package.json` e rifare la build.
