---
title: Introduzione
sidebar_position: 1
---

# SagreEventi

SagreEventi (*sagre ed eventi enogastronomici*) è un'applicazione web per consultare, segnalare e gestire sagre ed eventi enogastronomici. Chiunque può segnalare un evento e vedere cosa c'è in programma, senza account. La modifica degli eventi esistenti è riservata agli utenti con ruolo `Admin` o `Editor`.

La soluzione è composta da un'API ASP.NET Core (solo API, nessuna interfaccia ospitata) e da un client Angular + PrimeNG che la usa. Due container Docker (API e Angular) girano dietro il nginx dell'host. L'app **non** vende biglietti e non gestisce prenotazioni.

## Da dove iniziare

| Pagina | Contenuto |
| --- | --- |
| [Architettura](architettura.md) | Progetti della soluzione e motivazioni dello stack |
| [Configurazione](configurazione.md) | Impostazioni dell'API e variabili d'ambiente |
| [Mappa e posizione](mappa.md) | Posizione degli eventi, ricerca indirizzi e servizi esterni della mappa |
| [API](api.md) | Endpoint, autenticazione e forma degli eventi |
| [Protezione anti-bot](anti-bot.md) | Prova di lavoro sull'invio delle segnalazioni |
| [Moderazione](moderazione.md) | Stati degli eventi e avviso via email ai moderatori |
| [Sincronizzazione offline-first](sincronizzazione-offline-first.md) | Come il client tiene una copia locale e si sincronizza con l'API |
| [Sincronizzazione PWA](sincronizzazione-pwa.md) | Installazione, uso offline e aggiornamenti della PWA |
| [Sviluppo](sviluppo.md) | Build, test e migrazioni del database |
| [Deployment](deployment.md) | Avvio con Docker e reverse proxy |
| [Informazioni](informazioni.md) | Pagina Informazioni: licenza, codice sorgente e versione dell'applicazione |

Il codice sorgente è su [GitHub](https://github.com/AngeloDotNet/SagreEventi).
