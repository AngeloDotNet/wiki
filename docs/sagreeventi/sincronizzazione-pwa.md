---
title: Sincronizzazione PWA
sidebar_position: 8
---

## Sincronizzazione PWA

Il client è una PWA installabile (web manifest, icone, service worker di Angular). Il service worker mette in cache solo i file dell'applicazione, **non** le chiamate `/api`: i dati restano nello store offline-first descritto in [Sincronizzazione offline-first](sincronizzazione-offline-first.md), così sul dispositivo c'è un'unica fonte di verità.

- **Offline:** le pagine già visitate e la struttura dell'app si aprono senza rete. Il pulsante di sincronizzazione diventa un'icona Wi-Fi barrata e un avviso rosso segnala quando una pagina mai aperta non si può caricare.
- **Aggiornamenti:** il browser scarica una nuova versione in background; l'app chiede al server se ce n'è una nuova ogni ora e quando torna in primo piano (almeno 5 minuti dopo l'ultimo controllo). Quando è pronta compare un'icona di download nella barra in alto (con un breve avviso); cliccandola l'app si ricarica. Niente si ricarica da solo, quindi un modulo in compilazione non va mai perso.
- **Solo in produzione:** il service worker è disattivato con `ng serve`. Per provarlo, servi la build di produzione (`ng build`, poi un qualsiasi server statico) su `localhost` o in HTTPS.
- **Hosting:** `ngsw.json` e `ngsw-worker.js` non vanno mai serviti con una cache HTTP lunga; vedi [DEPLOY.md](https://github.com/AngeloDotNet/SagreEventi/blob/main/DEPLOY.md#pwa-installazione-offline-e-aggiornamenti).

| Online | Offline | Nuova versione pronta |
|---|---|---|
| <img src="/img/pwa-online-home.png" alt="Home page, online" width="250"> | <img src="/img/pwa-offline-home.png" alt="Home page aperta senza rete: il pulsante di sincronizzazione mostra un'icona Wi-Fi barrata" width="250"> | <img src="/img/pwa-aggiornamento.png" alt="Icona di download nella barra in alto e avviso di nuova versione" width="250"> |
