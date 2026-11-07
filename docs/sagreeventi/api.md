---
title: API
sidebar_position: 4
---


| Endpoint | Metodo | Scopo |
| --- | --- | --- |
| `/api/Eventi/GetEventi?since={datetime}` | GET | Eventi modificati dopo `since` |
| `/api/Eventi/UpdateEventi` | PUT | Inserisce nuovi eventi (anonimo, max 20 per richiesta, con limite di frequenza per IP). Aggiorna quelli esistenti solo con un token `Admin`/`Editor` |
| `/api/Eventi/GetChallenge` | GET | Challenge anti-bot firmata (anonimo, con limite di frequenza per IP, mai in cache) |
| `/api/Eventi/GetStati?ids=...` | GET | Stato degli eventi che hai segnalato (max 50 id). Un evento rifiutato risulta `InAttesa` |
| `/api/Eventi/Revisione/*` | GET, POST | Coda di revisione, approvazione, rifiuto ed eventi conclusi; solo `Admin`/`Editor` (`Conclusi` solo `Admin`) |
| `/api/admin/utenti` | GET, POST, PUT, DELETE | Gestione utenti, solo `Admin` |
| `/api/admin/ruoli` | GET | Elenco dei ruoli, solo `Admin` |
| `/api/auth/login`, `/api/auth/refresh`, `/api/auth/me` | POST, GET | Token bearer e di refresh, utente corrente. La registrazione è disattivata. Login e refresh hanno un limite di 10 richieste al minuto per IP |

Il server imposta da solo `dataOraUltimaModifica` a ogni scrittura; il valore inviato dal client serve solo a decidere quale versione sia più recente. Il documento OpenAPI è su `/openapi/v1.json` in Development.

Un evento ha questa forma (JSON, camelCase):

```json
{
  "id": "0b1e9e8e-5c0f-4a5e-8d0e-6b1a2f6c9a11",
  "nomeEvento": "Sagra della castagna",
  "cittaEvento": "Soriano nel Cimino",
  "indirizzo": "Piazza Vittorio Emanuele",
  "latitudine": 42.438300,
  "longitudine": 12.109500,
  "dataInizioEvento": "2026-10-24T00:00:00",
  "dataFineEvento": "2026-10-26T00:00:00",
  "descrizioneEvento": "Caldarroste, vino novello e musica dal vivo.",
  "eventoConcluso": false,
  "dataOraUltimaModifica": "2026-10-22T18:30:00.000Z",
  "stato": "Approvato"
}
```

`stato` e `motivoRifiuto` sono solo in uscita: la nota del rifiuto (al massimo 500 caratteri) compare nelle risposte di revisione e non viene mai mostrata a chi ha segnalato l'evento. `indirizzo`, `latitudine` e `longitudine` sono facoltativi: le coordinate vanno indicate insieme, con latitudine tra -90 e 90, longitudine tra -180 e 180 e al massimo 6 decimali. I campi di testo hanno lunghezze massime (id 100, nome 200, città 100, indirizzo 200, descrizione 4000); valori più lunghi ricevono `400`.
