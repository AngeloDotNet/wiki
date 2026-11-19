---
title: Test
sidebar_position: 5
---

# Test

## Test automatici

`dotnet test` dalla radice della soluzione esegue i test unitari, un progetto per livello, e i test di architettura e di integrazione.

- **Test unitari** per Domain, Application, Infrastructure e Api, con xUnit v3 sul Microsoft Testing Platform.
- **Test di contratto OpenAPI**: il documento servito in ambiente di sviluppo deve coincidere con `admin-ui/openapi/openapi.json`. Lo schema si rigenera con `PERSONALIDP_UPDATE_OPENAPI=true dotnet test tests/PersonalIdp.IntegrationTests --filter OpenApi`.
- **Test di architettura** con NetArchTest.Rules: verificano che i livelli dipendano solo da quelli consentiti.
- **Test di integrazione** con `WebApplicationFactory` su un database PostgreSQL di prova.

### Database dei test di integrazione

A ogni esecuzione i test creano un database con nome `personalidp_test_<guid>`, applicano le migrazioni e lo cancellano alla fine. L'utente del server deve poter creare ed eliminare database.

La connessione al server va nei user-secrets del progetto di test, mai nel repository:

```powershell
cd tests/PersonalIdp.IntegrationTests
dotnet user-secrets set "ConnectionStrings:Test" "Host=<host>;Port=5432;Database=postgres;Username=<utente>;Password=<password>"
```

In alternativa si usa la variabile d'ambiente `ConnectionStrings__Test`. Senza una delle due, i test di integrazione falliscono e l'errore nomina entrambe le fonti.

### Copertura

```powershell
dotnet test PersonalIdp.slnx --coverlet --coverlet-output-format cobertura
```

Il requisito di progetto è una copertura dell'80% sulla logica di business del codice nuovo o modificato.

### Console di amministrazione

Dalla cartella `admin-ui/`:

```powershell
npm test
npm run lint
npm run build
```

I test usano Vitest. `npm run build` lancia prima la generazione del client API, quindi richiede `dotnet tool restore` dalla radice del repository.

## Test end-to-end

Gli script PowerShell in `tools/e2e` richiedono l'applicazione avviata e leggono le credenziali dai user-secrets. Gli script non contengono segreti.

| Script | Cosa verifica |
|---|---|
| `oidc-flow.ps1` | Login, code con PKCE, userinfo, refresh, riuso del code |
| `admin-api.ps1` | API admin per client, scope, utenti e ruoli, risposte 401 e 403, blocco con revoca immediata |
| `mfa.ps1` | Attivazione TOTP, login con il secondo fattore, codici di recupero, claim `amr`, reset da admin |
| `profilo.ps1` | Profilo, claim nei token e in userinfo, cambio password; con `-Expiry` anche la scadenza |
| `cleanup-user.ps1` | Elimina un utente di prova tramite le API admin |

Gli script sono scritti per Windows PowerShell 5.1.
