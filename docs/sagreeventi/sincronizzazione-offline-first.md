---
title: Sincronizzazione offline-first
sidebar_position: 7
---

## Sincronizzazione offline-first

Il client Angular tiene una propria copia degli eventi e si sincronizza con l'API in tre passi:

1. **Push:** gli eventi creati o modificati sul dispositivo sono inviati con `PUT /api/Eventi/UpdateEventi`, ciascuna richiesta con una prova anti-bot (vedi [Protezione anti-bot](anti-bot.md)).
2. **Pull:** le modifiche degli altri sono scaricate con `GET /api/Eventi/GetEventi?since=<cursore>`.
3. **Merge:** i dati del server sostituiscono quelli locali, a meno che la copia locale sia in attesa e più recente. Gli eventi conclusi vengono rimossi.

La sincronizzazione parte all'avvio, quando il browser torna online, quando premi il pulsante di sincronizzazione nella barra in alto e in automatico quando l'app torna in primo piano (almeno 5 minuti dopo l'ultima) e ogni 10 minuti mentre la pagina è aperta e visibile.
