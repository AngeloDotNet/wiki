---
title: API di gestione
sidebar_position: 6
---

# API di gestione

Per il pannello admin. Richiede un token con scope `licensing.write`, ruolo `license-admin` e MFA. Mancano ancora licenze, assegnazioni manuali e impostazioni (passi 6c e 6d).

## Convenzioni

- **Elenchi:** `pageNumber` (da 1), `pageSize` (20 predefinito, 100 massimo), `sortBy` (`key`, `name`, `createdAt`), `sortDirection` (`ASC` o `DESC`) e `search` (senza distinzione di maiuscole; `%` e `_` sono cercati come testo). Risposta `{ items, totalCount, pageNumber, pageSize }`.
- **Errori:** `ProblemDetails` con chiavi `ERROR_*`: 400 validazione, 404 non trovato, 409 conflitto, 422 regola di business, 429 troppe richieste.
- **Limiti:** 120 richieste al minuto per client, corpo massimo 64 KB. I campi non previsti (come `id` o `createdAt`) sono ignorati.

## Prodotti e piani

| Metodo e percorso | Cosa fa |
| --- | --- |
| `GET /v1/products` | Elenco paginato di prodotti |
| `POST /v1/products` | Crea un prodotto (`key` immutabile) |
| `GET/PUT/DELETE /v1/products/{productId}` | Legge, modifica, elimina (solo se senza piani, licenze o impostazioni) |
| `GET/POST /v1/products/{productId}/plans` | Elenco paginato e creazione di piani |
| `GET/PUT/DELETE /v1/products/{productId}/plans/{planId}` | Legge, sostituisce la definizione, elimina (solo se nessuna licenza lo usa) |

La `key` di un prodotto o di un piano ammette `a-z 0-9 . _ -`. Le feature di un piano hanno chiavi `features.*`, i limiti `limits.*` con valori non negativi; al massimo 50 voci per tipo.

## Account e membri

| Metodo e percorso | Cosa fa |
| --- | --- |
| `GET /v1/accounts` | Elenco paginato (`key` e `name` ordinano per nome) |
| `POST /v1/accounts` | Crea un account (`name`, `type`: `individual` o `organization`) |
| `GET/PUT /v1/accounts/{accountId}` | Legge, rinomina |
| `POST /v1/accounts/{accountId}/convert-to-organization` | Trasforma un account individuale in organizzazione |
| `DELETE /v1/accounts/{accountId}` | Elimina account e membri, solo senza licenze |
| `GET/POST /v1/accounts/{accountId}/members` | Elenco paginato e aggiunta di un membro per `sub` |
| `GET/PUT/DELETE /v1/accounts/{accountId}/members/{membershipId}` | Legge, cambia ruolo, rimuove |

### Regole sui membri

- I membri esistono solo nelle organizzazioni (422 `ERROR_ACCOUNT_CANNOT_HAVE_MEMBERS`).
- L'aggiunta usa il `sub` di Keycloak, con email facoltativa e ruolo `owner`, `admin` o `member`; l'utente viene creato se il `sub` è nuovo.
- Un utente è membro una sola volta per account (409 `ERROR_MEMBER_ALREADY_EXISTS`).
- L'ultimo `owner` non si può declassare né rimuovere (422 `ERROR_LAST_OWNER`).
- Un account con licenze non si elimina (409 `ERROR_ACCOUNT_IN_USE`).
- Una membership di un altro account risponde 404.
