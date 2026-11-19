---
title: Introduzione
sidebar_position: 1
---

# Identity Provider

Identity Provider è un identity provider personale: gestisce l'accesso degli utenti e rilascia i token alle applicazioni che lo usano. Nasce come sostituto di Keycloak ed è costruito su OpenIddict 7.9 e ASP.NET Core Identity, su .NET 10 con PostgreSQL.

Le applicazioni si collegano come client OpenID Connect: fanno login con il codice di autorizzazione e PKCE, ricevono i token e leggono i dati dell'utente da userinfo. Gli amministratori gestiscono client, scope, utenti, ruoli e permessi dalla console di amministrazione, che usa le stesse API admin.

## Cosa fa

- **Login OpenID Connect** con code flow, PKCE, refresh token e discovery (`/.well-known/openid-configuration`).
- **Autenticazione a due fattori** (TOTP) con codici di recupero e claim `amr` nei token.
- **Profilo utente** (nome, cognome, lingua) con i claim nei token e in userinfo.
- **Scadenza della password** configurabile, con cambio obbligatorio al login.
- **Messaggi localizzati** in italiano e inglese, serviti da un endpoint dedicato.
- **Permessi gestiti nel database**: i ruoli concedono permessi granulari, che si possono creare, descrivere e cancellare; i permessi di sistema restano fissi.
- **API admin** per client, scope, utenti, ruoli e permessi, con revoca immediata dell'accesso.
- **Console di amministrazione** (SPA Angular in `admin-ui/`): mostra le sezioni in base ai permessi dell'utente e usa la sessione a cookie del login.
- **Posta di conferma e recupero** inviata tramite SMTP in background.

:::info Stato di sviluppo
Il progetto è in sviluppo. Le funzioni descritte qui sono quelle già presenti nel repository; lo stato di avanzamento è nel changelog del repository applicativo.
:::

## Dove continuare

- [Avvio](avvio.md): requisiti, prima configurazione e primo accesso.
- [Configurazione](configurazione.md): secrets, SMTP, MFA, password e localizzazione.
- [Architettura](architettura.md): struttura della soluzione e decisioni principali.
- [Test](test.md): test unitari, di integrazione ed end-to-end.
