---
title: Sviluppo
sidebar_position: 7
---

# Sviluppo

## Prerequisiti

- .NET SDK 10 (versione fissata in `global.json`).
- Un'istanza PostgreSQL 16 di prova per gli integration test.

## Comandi

```bash
dotnet build
dotnet test
dotnet run --project src/Licensing.Api
```

La build tratta i warning e gli analyzer di sicurezza come errori. I pacchetti si gestiscono in modo centralizzato (`Directory.Packages.props`) con lock file; l'audit si esegue con `dotnet list package --vulnerable --include-transitive`.

## Test

- **Unit test:** dominio, validatori, mappatura dei risultati, configurazione.
- **Architettura:** la regola delle dipendenze tra i progetti.
- **Integration test:** endpoint e persistenza su un database PostgreSQL reale. La stringa di connessione arriva da User Secrets o dalla variabile `ConnectionStrings__Test`; senza, i test falliscono con un messaggio che la nomina. A ogni esecuzione si crea un database con nome univoco, con le migrazioni applicate, eliminato a fine esecuzione.
- **Sicurezza:** 401 e 403 per scope, ruolo e MFA mancanti, token falsificati o scaduti, input ostili (SQL, caratteri di controllo, campi troppo lunghi, JSON malformato, overposting), isolamento tra account e rate limiting.

Mai EF Core InMemory né SQLite: i test usano il motore reale.

## Migrazioni

```bash
dotnet ef migrations add NomeMigrazione --project src/Licensing.Infrastructure --startup-project src/Licensing.Api
```

Le migrazioni sono versionate e non si modificano una volta applicate. All'avvio il container le applica con l'utente delle migrazioni (`Database__MigrateOnStartup`).

## Documentazione

Le pagine di questa wiki descrivono il comportamento del repository applicativo e si aggiornano insieme al codice, a ogni passo che cambia comportamento, configurazione o struttura.
