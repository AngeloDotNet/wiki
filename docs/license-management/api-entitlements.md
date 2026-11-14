---
title: API di validazione
sidebar_position: 5
---

# API di validazione degli entitlements

```http
GET /v1/accounts/{accountId}/products/{productKey}/entitlements
Authorization: Bearer <token con scope licensing.read>
```

Il token si ottiene con client credentials. Accetta anche lo scope `licensing.write`.

## Risposta

| Campo | Significato |
| --- | --- |
| `status` | `none`, `trial`, `active`, `grace`, `suspended`, `expired` |
| `access` | `full`, `readOnly`, `none` |
| `validUntil`, `graceUntil` | Scadenze (UTC), se presenti |
| `plan` | Piano della licenza |
| `features` | Feature del piano (`features.*`), vuote senza accesso |
| `limits` | Limiti del piano (`limits.*`), vuoti senza accesso |
| `version` | Hash SHA-256 del contenuto; è anche l'`ETag` |
| `cacheTtlSeconds` | Per quanto tempo l'app può tenere la risposta in cache |
| `staleToleranceSeconds` | Per quanto tempo può usarla se il servizio non risponde |

Il tempo è applicato in lettura: una licenza oltre la scadenza risponde subito con lo stato corretto anche prima che il job in background la aggiorni.

## Comportamento

- **Cache condizionale:** l'app può rinviare `version` in `If-None-Match` e ricevere 304.
- **Nessuna licenza:** risposta 200 con `status: none` e nessuna feature.
- **Account o prodotto inesistenti:** 404.
- **`productKey` non valida** (solo `a-z 0-9 . _ -`, massimo 64 caratteri): 400 con chiavi `ERROR_*`.
- **Senza accesso** (sospesa o scaduta) feature e limiti sono vuoti: in caso di dubbio il servizio nega.

## Come usarla nell'app

1. Chiedere gli entitlements all'avvio e tenere la risposta in cache per `cacheTtlSeconds`.
2. Alla scadenza rinnovare con `If-None-Match`.
3. Se il servizio non risponde, usare l'ultima risposta per al massimo `staleToleranceSeconds`, poi negare l'accesso.
