---
title: Configurazione
sidebar_position: 4
---

# Configurazione

Tutti i valori reali arrivano da variabili d'ambiente (elencate in `.env.example` del repository, mai committate). Nei file di configurazione ci sono solo segnaposto `CHANGE-ME`. Fuori da Development l'avvio fallisce se un valore è mancante o ancora segnaposto, se `AllowedHosts` è `*` o se non c'è alcun proxy fidato.

| Variabile | Significato |
| --- | --- |
| `ConnectionStrings__Default` | Utente applicativo del database, senza DDL |
| `ConnectionStrings__Migrations` | Utente delle migrazioni, con DDL; usato solo all'avvio |
| `AllowedHosts` | Host ammessi, elencati esplicitamente |
| `Security__PublicBaseUrl` | Indirizzo pubblico `https` del servizio |
| `Security__KnownProxies__N`, `Security__KnownNetworks__N` | Proxy fidati (nginx) per `X-Forwarded-*` |
| `Security__AllowedCorsOrigins__N` | Origine del pannello ammessa da CORS |
| `Authentication__Authority` | Issuer di Keycloak (realm) |
| `Authentication__Audience` | Audience attesa (`licensing-api`) |
| `Authentication__RoleClientId` | Client da cui leggere i ruoli in `resource_access` |
| `Authentication__AcceptedAmr__N` | Valori di `amr` che indicano la MFA (predefiniti `mfa` e `otp`) |
| `ConnectionStrings__Test` | Solo test: istanza PostgreSQL di prova |

## Impostazioni con valori predefiniti

| Sezione | Impostazione | Predefinito |
| --- | --- | --- |
| `Database` | `MigrateOnStartup` | `true` |
| `Paging` | `DefaultPageSize`, `MaxPageSize`, `MaxPageNumber` | 20, 100, 10000 |
| `RateLimiting` | `EntitlementsPerMinute`, `ManagementPerMinute` | 600, 120 |

## Cache degli entitlements

La risposta dell'API di validazione indica quanto le app possono tenerla in cache (`cacheTtlSeconds`) e per quanto possono usarla se il servizio non risponde (`staleToleranceSeconds`). Il valore si sceglie in quest'ordine: override del prodotto, impostazione globale, predefinito (300 secondi di cache e 24 ore di tolleranza).

## Database

PostgreSQL 16, già presente sul server. Il servizio usa due utenti distinti: quello applicativo ha solo DML, quello delle migrazioni ha DDL e serve soltanto all'avvio. La connessione deve essere cifrata con certificato verificato.
