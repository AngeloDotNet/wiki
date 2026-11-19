---
title: Avvio
sidebar_position: 2
---

# Avvio

## Requisiti

- Runtime .NET 10. Il progetto punta a `net10.0`, quindi si può compilare anche con un SDK più recente.
- Node 24 LTS, che serve a Tailwind (`src/PersonalIdp.Api`) e alla console (`admin-ui/`): la build rigenera `wwwroot/css/app.css` se esiste `node_modules`.
- Un server PostgreSQL raggiungibile e un server SMTP di test.

## Prima configurazione

Dalla cartella del progetto host (`src/PersonalIdp.Api`):

```powershell
npm ci
dotnet user-secrets set "ConnectionStrings:Default" "Host=<host>;Port=5432;Database=<database>;Username=<utente>;Password=<password>"
dotnet user-secrets set "Seed:Admin:Email" "admin@example.com"
dotnet user-secrets set "Seed:Admin:Password" "<password forte per l'amministratore>"
dotnet user-secrets set "Seed:Clients:1:ClientSecret" "<segreto casuale di 64 caratteri>"
dotnet user-secrets set "Coravel:Mail:Host" "<host SMTP>"
dotnet user-secrets set "Coravel:Mail:Username" "<utente SMTP>"
dotnet user-secrets set "Coravel:Mail:Password" "<password SMTP>"
```

I segreti non vanno mai nel repository: restano nei user-secrets della macchina di sviluppo o nelle variabili d'ambiente del server.

Per applicare le migrazioni al primo avvio si imposta una volta sola la variabile `Database__MigrateOnStartup` a `true`. Dopo il primo avvio non serve più. Le migrazioni `AddLocalization` e `AddPermissions` vanno applicate prima di usare la localizzazione e la gestione dei permessi.

Su un database già esistente, `Database__MigrateOnStartup` può fallire con `PendingModelChangesWarning`: in quel caso le migrazioni si applicano con `dotnet ef database update`, passando la connessione dai user-secrets.

## Avvio in locale

```powershell
dotnet run --launch-profile https
```

L'applicazione risponde su `https://localhost:7139`.

## Console di amministrazione

La console è un'applicazione Angular separata, nella cartella `admin-ui/`. Richiede l'API avviata e la sua configurazione si legge da `config.json` prima di ogni richiesta.

Dalla radice del repository, una volta sola:

```powershell
dotnet tool restore
```

Poi dalla cartella `admin-ui/`:

```powershell
npm ci
npm start
```

`npm start` avvia il server di sviluppo su `http://localhost:4200`. Il client API è generato dallo schema `admin-ui/openapi/openapi.json`: `npm run build` lancia prima la generazione, quindi richiede lo strumento `dotnet tool restore`.

## Primi percorsi

| Percorso | A cosa serve |
|---|---|
| `/Account/Login` | Login con l'account amministratore dei secrets |
| `/.well-known/openid-configuration` | Discovery OpenID Connect |
| `/Account/Manage/Profile` | Profilo: nome, cognome, lingua |
| `/Account/Manage/ChangePassword` | Cambio password |
| `/Account/Manage/TwoFactor` | Gestione dell'autenticazione a due fattori |

Le opzioni di configurazione sono descritte in [Configurazione](configurazione.md).
