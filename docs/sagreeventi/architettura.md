---
title: Architettura
sidebar_position: 2
---


| Progetto | Responsabilità |
| --- | --- |
| `src/SagreEventi.Shared` | Modelli condivisi (`EventoModel`, DTO di moderazione) |
| `src/SagreEventi.Web.Server` | Minimal API ASP.NET Core (.NET 10): endpoint, Identity, migrazioni EF Core, FusionCache, servizi in background (scadenza degli eventi e avviso email ai moderatori con MailKit) |
| `src/SagreEventi.Web` | Client Angular 21 (componenti standalone, signal, zoneless) con PrimeNG e un preset Aura personalizzato |
| `tests/SagreEventi.Web.Server.Tests` | Test di integrazione dell'API (xUnit, SQLite in memoria) |
| `src/SagreEventi.Web/src/app/**/*.spec.ts` | Unit test del client (Vitest, jsdom), ciascuno accanto al proprio sorgente |
| `deploy/docker-compose.yml`, `deploy/docker-compose.*.yml`, `deploy/sites-available` | Due container (Angular e API) dietro il nginx dell'host, da un compose unico o da due separati, vedi [Deployment](deployment.md) e [DEPLOY.md](https://github.com/AngeloDotNet/SagreEventi/blob/main/DEPLOY.md) |
| `.github/workflows/build-push.yml` | Compila e testa (API e client), poi pubblica le immagini API e Angular su Docker Hub (push su `main` o tag `X.Y.Z`) |

I componenti Angular tengono template, stili e classe in file separati (`x.component.ts`, `x.component.html` e `x.component.css` solo se il componente ha stili); ogni componente, servizio o altro file non di componente sta in una cartella con il proprio nome: `core/<nome>/`, `shared/<nome>/` e `features/<area>/<pagina>/`, anche quando la feature ha una sola pagina. I confini tra cartelle sono verificati dal lint: una feature non importa da un'altra feature, e `core/` e `shared/` non importano da `features/`.

## Perché questo stack

- **Un solo contratto, molti client:** l'API è un pugno di endpoint, quindi un nuovo client è questione di un fine settimana.
- **Offline-first:** gli eventi stanno in `localStorage` e un piccolo passo di sincronizzazione li riallinea con SQL Server.
- **Poche parti mobili nel client:** Angular, PrimeNG (tema e icone) e RxJS. Nessuna libreria di stato e nessun framework CSS.
- **Configurazione a runtime:** l'indirizzo dell'API è letto da `config.json`, quindi una sola build funziona in ogni ambiente.
