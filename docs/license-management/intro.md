---
title: Introduzione
sidebar_position: 1
---

# License Manager

License Manager è un servizio per gestire in modo centralizzato le licenze delle web app SaaS del proprietario. Copre piani free, trial e a pagamento, scadenze, limiti e feature per piano, con un pannello admin e un audit log append-only.

Le app SaaS chiedono al servizio cosa può fare un account con un prodotto (gli *entitlements*) e mettono in cache la risposta. Gli amministratori gestiscono prodotti, piani, account, membri e licenze dal pannello admin, che usa l'API di gestione.

:::info Stato di sviluppo
Il progetto è in sviluppo (fase 1, backend). Sono pronti il dominio, la persistenza, la sicurezza, l'API di validazione degli entitlements e, nell'API di gestione, prodotti, piani, account e membri. Mancano licenze e impostazioni nell'API di gestione, audit, webhook di pagamento, job in background, deploy e pannello admin. Le pagine descrivono ciò che esiste oggi e si aggiornano a ogni passo.
:::

## Cosa fa

- **Validazione delle licenze:** un endpoint per account e prodotto restituisce stato, accesso, scadenze, piano, feature e limiti, con cache e tolleranza configurabili.
- **Gestione:** prodotti, piani, account, membri e licenze (anche assegnazioni manuali) dal pannello admin.
- **Pagamenti:** webhook neutri rispetto al provider (previsti nei passi successivi).
- **Audit:** registro append-only delle operazioni rilevanti (previsto).

## Da dove iniziare

| Pagina | Contenuto |
| --- | --- |
| [Architettura](architettura.md) | Progetti della soluzione, dominio e stati della licenza |
| [Sicurezza](sicurezza.md) | Identità con Keycloak, scope, ruoli, MFA e protezioni dell'API |
| [Configurazione](configurazione.md) | Variabili d'ambiente e impostazioni |
| [API di validazione](api-entitlements.md) | L'endpoint degli entitlements usato dalle app |
| [API di gestione](api-gestione.md) | Prodotti, piani, account e membri per il pannello admin |
| [Sviluppo](sviluppo.md) | Build, test e migrazioni |

## Stack

Backend .NET 10 con Minimal API, EF Core e PostgreSQL 16; identità su Keycloak già presente sul server; pannello admin in Angular con PrimeNG (previsto). Il servizio non gestisce password: verifica solo i token JWT emessi da Keycloak.
