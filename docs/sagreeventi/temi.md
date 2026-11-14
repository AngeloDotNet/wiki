---
title: Temi
sidebar_position: 13
---

# Temi dell'applicazione

L'app ha sette temi: due sempre disponibili (chiaro e scuro) e cinque stagionali, che compaiono nel menu dei temi solo in certi periodi dell'anno. I periodi si leggono dal server e l'**Admin** può cambiarli dalla scheda **Temi** di Gestione, senza una nuova versione dell'app.

## Temi disponibili

| Tema | Disponibilità | Base |
| --- | --- | --- |
| Chiaro | sempre | chiara |
| Scuro | sempre | scura |
| Pasqua | nel periodo di Pasqua | chiara |
| Ferragosto | nel periodo di Ferragosto | chiara |
| Halloween | nel periodo di Halloween | scura |
| Natale chiaro | nel periodo di Natale | chiara |
| Natale scuro | nel periodo di Natale | scura |

I due temi di Natale condividono lo stesso periodo: i periodi configurabili sono quattro (Pasqua, Ferragosto, Halloween, Natale).

## Periodi iniziali

Sono i valori con cui parte la tabella `PeriodiTema` e quelli che l'app usa finché il server non risponde.

| Periodo | Dal | Al |
| --- | --- | --- |
| Pasqua | 7 giorni prima della domenica di Pasqua | 1 giorno dopo la domenica di Pasqua |
| Ferragosto | 1 agosto | 20 agosto |
| Halloween | 24 ottobre | 31 ottobre |
| Natale | 1 dicembre | 6 gennaio (attraversa la fine dell'anno) |

Pasqua è una regola, non una data: la domenica di Pasqua si ricalcola ogni anno (calendario gregoriano) e il periodo si sposta di conseguenza. Gli altri periodi hanno giorno e mese di inizio e di fine; se la fine cade prima dell'inizio nel calendario, il periodo attraversa il capodanno.

## Come viene scelto il tema

- Il menu dei temi mostra un tema stagionale solo dentro il suo periodo; un periodo disattivato non rende disponibile il suo tema in nessuna data.
- All'avvio vale il tema salvato su quel dispositivo, se esiste ed è in stagione. Un tema salvato che non esiste più diventa il chiaro; un tema stagionale scaduto, o l'assenza di una scelta, seguono la preferenza chiaro/scuro del sistema.
- I periodi si caricano all'avvio dell'app **senza attenderli**. Finché il server non risponde, o se non si raggiunge, o se la risposta non contiene tutti e quattro i periodi, valgono i periodi iniziali: l'app resta usabile anche offline.
- Se l'utente sceglie un tema durante la sessione, un caricamento successivo dei periodi non lo cambia.

## Scheda «Temi» (solo Admin)

Si apre da **Gestione → Temi** (`/gestione/temi`) ed è riservata al ruolo `Admin`. Ha una scheda per periodo; da 768 px di larghezza le schede sono affiancate a due a due, sul telefono una sotto l'altra. In ogni scheda i gruppi stanno in colonna (Inizio sopra Fine) e Giorno e Mese condividono la riga. I campi sono:

- **Attivo:** interruttore; un periodo disattivato non offre il suo tema in nessuna data (per Natale vale per entrambi i temi).
- **Pasqua:** giorni prima (da 0 a 14) e giorni dopo (da 0 a 7) la domenica di Pasqua, con l'avviso che le date esatte si ricalcolano da sole ogni anno.
- **Ferragosto, Halloween e Natale:** giorno e mese di inizio e di fine. Il periodo può durare al massimo 60 giorni, contando il primo e l'ultimo, e può attraversare la fine dell'anno; il 29 febbraio non è ammesso come estremo.

I quattro periodi si salvano insieme. Se il server rifiuta qualcosa, l'errore compare accanto al campo e un riepilogo in cima alla pagina. Il salvataggio vale per tutti i visitatori: ogni dispositivo lo applica al caricamento successivo dell'app.

## Endpoint

| Endpoint | Metodo | Scopo |
| --- | --- | --- |
| `/api/temi/periodi` | GET | Elenco dei quattro periodi (anonimo) |
| `/api/temi/periodi` | PUT | Salva i quattro periodi e restituisce quelli salvati; solo `Admin` (policy `SoloAdmin`), risposta con `Cache-Control: no-store` |

Il corpo del `PUT` è la lista dei quattro periodi, ognuno con `chiave` (`pasqua`, `ferragosto`, `halloween`, `natale`), `attivo`, i quattro campi di giorno e mese e i due campi di Pasqua; i campi che non riguardano il periodo restano `null`. Un campo `attivo` mancante viene letto come `false`. Il server controlla tutto il corpo prima di salvare:

- ogni chiave compare una sola volta e non ne mancano;
- giorno e mese devono esistere (anno non bisestile) e la durata non supera 60 giorni;
- Pasqua accetta solo i due campi dei giorni, entro i limiti sopra; gli altri periodi non accettano i campi di Pasqua.

Un corpo non valido riceve `400` con `ProblemDetails` e un errore per campo (`periodi[0].giornoInizio`, ...). Un utente non autenticato riceve `401`, un `Editor` `403`. I messaggi del validatore sono in italiano.

## Cache

La lettura pubblica passa da FusionCache in memoria (solo L1): 5 minuti, con fail-safe e jitter come per gli eventi. Ogni salvataggio invalida la cache (tag `periodi-tema`). Con più repliche della stessa app la coerenza è eventuale, fino a 5 minuti.

## Rilascio

I periodi stanno nella tabella `PeriodiTema`, creata dalla migrazione `AddPeriodiTema` con le quattro righe iniziali; la migrazione parte all'avvio del backend (flag `Database:MigraAllAvvio`, vedi [Configurazione](configurazione.md)). Backend e frontend vanno rilasciati insieme. Con il rilascio Halloween passa da 15 ottobre – 2 novembre a 24–31 ottobre.
