---
title: Architettura
sidebar_position: 2
---

# Architettura

Il backend segue la Clean Architecture: le dipendenze puntano verso l'interno e un test di architettura (NetArchTest.Rules) fa fallire la build se la regola viene violata.

| Progetto | Responsabilità |
| --- | --- |
| `src/Licensing.Domain` | Entità, enum e regole di business; nessuna dipendenza esterna |
| `src/Licensing.Application` | Casi d'uso (servizi), richieste e risposte, validatori FluentValidation, interfacce come `IApplicationDbContext` |
| `src/Licensing.Infrastructure` | EF Core con PostgreSQL, configurazioni, migrazioni, adapter esterni |
| `src/Licensing.Api` | Endpoint Minimal API, composizione, sicurezza HTTP |
| `src/Licensing.Contracts` | DTO condivisi (oggi vuoto) |
| `tests/Licensing.UnitTests` | Unit test e test di architettura |
| `tests/Licensing.IntegrationTests` | Integration test su un database PostgreSQL reale di prova |

## Scelte principali

- **Nessun repository, nessuna specification:** i servizi usano direttamente `IApplicationDbContext` con LINQ, `AsNoTracking` e proiezioni.
- **Modello ricco dove serve:** `Account` e `License` proteggono le proprie invarianti con factory e metodi di business; le altre entità sono anemiche.
- **Risultati, non eccezioni:** i servizi restituiscono `Result<T>` della libreria OperationResults; gli esiti attesi (non trovato, validazione, regola violata, conflitto) sono risultati mappati su `ProblemDetails` con chiavi di traduzione `ERROR_*`.
- **Nessuna multi-tenancy e nessun soft delete:** l'isolamento è per `accountId` nelle query, con test anti-IDOR. Le licenze non si cancellano, finiscono in `expired`; le chiavi esterne sono `Restrict`.
- **Migrazioni all'avvio:** applicate dal container con un utente database separato (con DDL), mentre l'API serve le richieste con un utente a privilegi minimi.

## Dominio

Un **account** (individuale o organizzazione) possiede **licenze**; ogni licenza lega un account a un **piano** di un **prodotto**. I **membri** (utenti di Keycloak, identificati dal `sub`) appartengono alle organizzazioni con ruolo `owner`, `admin` o `member`. Un piano definisce feature (`features.*`), limiti (`limits.*`), giorni di grazia e giorni di sospensione.

### Stati della licenza

| Stato | Significato | Accesso |
| --- | --- | --- |
| `trial` | Prova (14 giorni per impostazione predefinita) | pieno |
| `active` | Licenza valida | pieno |
| `grace` | Pagamento fallito, grazia (7 giorni per piano, solo piani a pagamento) | pieno |
| `suspended` | Sospesa (per mancato pagamento o a mano) | sola lettura |
| `expired` | Scaduta | nessuno |

Dopo la grazia la licenza passa a `suspended` e, trascorsi i giorni di sospensione del piano (30 per impostazione predefinita), a `expired`. Una sospensione manuale non scade da sola e la riattivazione ripristina lo stato precedente. Free e trial non hanno grazia.
