---
title: Architettura
sidebar_position: 4
---

# Architettura

PersonalIdp segue la Clean Architecture: le dipendenze vanno dall'esterno verso il dominio, e il dominio non dipende da nulla. Le regole di dipendenza sono verificate da test di architettura, quindi una dipendenza vietata non compila.

## Livelli della soluzione

| Livello | Contenuto |
|---|---|
| **Domain** | Catalogo di permessi e ruoli, regole pure del profilo, voci di traduzione. Nessuna dipendenza. |
| **Application** | Interfacce dei casi d'uso, tipi della posta, richieste con validatori, costanti delle chiavi di errore. Dipende solo da Domain. |
| **Infrastructure** | Contesto EF Core, utente applicativo, migrazioni, opzioni validate all'avvio, seed dei client OpenIddict, traduzioni, posta con coda in memoria e invio SMTP. Dipende da Domain e Application. |
| **Api** | Host web: API minimal, pagine Razor, endpoint OIDC, template delle email. È il punto di ingresso. |

## Console di amministrazione

La console è un'applicazione Angular in `admin-ui/`, fuori dalla soluzione .NET. Il client TypeScript si genera dallo schema OpenAPI versionato in `admin-ui/openapi/`, quindi le chiamate HTTP non si scrivono a mano. Lo schema è esposto solo in ambiente di sviluppo.

La console non gestisce il login: lo fanno le pagine Razor dell'host `Api`, e la console usa il cookie che ne deriva. La scelta è di servire la console su un host separato, sotto lo stesso dominio delle API, così il cookie resta valido; il dominio pubblico non è ancora definito.

## Decisioni di architettura

Le decisioni sono registrate come ADR nel repository applicativo, in `docs/adr/`:

- **0001**: Clean Architecture.
- **0002**: `OperationResult` come tipo di ritorno dei casi d'uso.
- **0003**: FluentValidation per le richieste.
- **0004**: OpenAPI attivo solo in ambiente di sviluppo.
- **0005**: endpoint in Minimal API e controller per il protocollo OIDC.
- **0006**: pagine Razor nell'host.
- **0007**: test di integrazione su un database PostgreSQL dedicato.
- **0008**: CSP con `style-src 'unsafe-inline'` e server di test degli header della SPA.

## Sicurezza

Le segnalazioni di vulnerabilità seguono il file `SECURITY.md` del repository applicativo. Le procedure di risposta agli incidenti sono nel runbook di sicurezza dello stesso repository.
