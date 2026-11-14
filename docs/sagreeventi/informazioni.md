---
title: Informazioni
sidebar_position: 11
---

# Pagina Informazioni

La pagina **Informazioni** (voce «Informazioni» del menu) descrive in breve l'applicazione e riporta tre blocchi: la licenza (MIT, con il link al file `LICENSE` su GitHub), il link al codice sorgente del repository e la versione dell'applicazione con la data della build.

## Versione e data della build

- **Versione:** quella del tag di rilascio `X.Y.Z` (senza prefisso `v`), passata dalla CI come `APP_VERSION` al build dell'immagine Angular. Nelle build senza tag (push su `main`, sviluppo locale, test) è il campo `version` di `src/SagreEventi.Web/package.json` (oggi `1.1.0`). Un valore di `APP_VERSION` che non sia esattamente `X.Y.Z` viene scartato.
- **Data:** la data (giorno, mese e anno, formato italiano) in cui è stata generata la build del client, calcolata nel fuso orario di Roma. Il testo della pagina la chiama «Data di rilascio», ma il valore è la data della build.

Il valore è generato dallo script `src/SagreEventi.Web/scripts/build-info.mjs`, che scrive il file `src/app/core/build-info-generated/build-info.generated.ts`. Lo script gira automaticamente prima di `npm run build`, `npm start`, `npm run watch` e dei test (script `pre*` di `package.json`), quindi non serve lanciarlo a mano. Il file generato non è versionato (è nel `.gitignore`) e non va modificato.

Nel client la pagina legge la versione e la data da quel file: per cambiare la versione di un rilascio basta creare e pubblicare il tag `X.Y.Z` su `main`, dopo il merge (la CI rifà la build con quella versione). In locale si può provare con `APP_VERSION=1.2.3 npm run build`.
