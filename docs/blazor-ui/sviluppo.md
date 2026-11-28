---
title: Sviluppo in locale
sidebar_position: 6
---

# Sviluppo in locale

## Requisiti

SDK .NET 10.0.404 o successivo della versione 10 (vedi `global.json`).

## Comandi

| Azione | Comando |
|---|---|
| Restore | `dotnet restore --locked-mode` |
| Build | `dotnet build` |
| Test | `dotnet test` |
| Formattazione | `dotnet format --verify-no-changes --no-restore` |
| Audit dei pacchetti | `dotnet list package --vulnerable --include-transitive` |

La build tratta gli avvisi come errori. Le versioni dei pacchetti sono in `Directory.Packages.props` e i file `packages.lock.json` vanno committati.

## Struttura

```
src/AngeloDotNet.Blazor.Ui/           libreria
samples/Gallery/, Gallery.Client/     app galleria
tests/AngeloDotNet.Blazor.Ui.Tests/   test (xUnit v3, bUnit)
tests/Gallery.E2E/                    test nel browser (Playwright)
docs/images/                          immagini del README
.github/                              pipeline e aggiornamento delle dipendenze
```

## Test nel browser

I test in `tests/Gallery.E2E` avviano da soli la galleria. Dopo la prima build, e a ogni aggiornamento di Playwright, si installano i browser (lo script può rimuovere le versioni precedenti non più usate):

```
pwsh tests/Gallery.E2E/bin/Debug/net10.0/playwright.ps1 install chromium firefox webkit
```

Il motore si sceglie con la variabile d'ambiente `BROWSER` (`chromium`, predefinito, `firefox` o `webkit`). `dotnet test` sull'intera soluzione esegue anche questi test, quindi richiede almeno Chromium.

Per i soli test unitari, senza browser:

```
dotnet test --project tests/AngeloDotNet.Blazor.Ui.Tests
```

La suite completa nel browser si esegue alla fine di ogni fase.

## Integrazione continua

I file sono in `.github/`.

| Workflow | Quando | Cosa esegue |
|---|---|---|
| `ci.yml` | a ogni pull request verso `develop` o `main`, oppure a mano | restore con lock file, build `Release`, test unitari, formattazione, pacchetti vulnerabili, licenze, ricerca di segreti in tutta la storia (gitleaks) |
| `browser.yml` | solo a mano | test nel browser con Chromium, Firefox e WebKit |

L'avvio manuale di un workflow è disponibile su GitHub solo quando il file è presente sul branch predefinito. Le pipeline non sono ancora state eseguite.

Gli stessi controlli sui pacchetti si eseguono in locale con:

```
pwsh .github/scripts/check-vulnerabilities.ps1
dotnet tool restore
dotnet nuget-license --input AngeloDotNet.Blazor.Ui.slnx --include-transitive --allowed-license-types .github/allowed-licenses.json
```

`dotnet list package --vulnerable` termina con successo anche quando trova vulnerabilità: per questo la CI usa lo script. Le licenze ammesse sono in `.github/allowed-licenses.json`.

Dependabot (`.github/dependabot.yml`) propone ogni settimana verso `develop` gli aggiornamenti di pacchetti NuGet e GitHub Actions, dopo 7 giorni dalla pubblicazione di una versione. Gli aggiornamenti di sicurezza non aspettano e vanno sul branch predefinito. La versione di gitleaks e il suo checksum, in `ci.yml`, si aggiornano a mano.

## Galleria

L'app per vedere e provare la libreria. La modalità si sceglie all'avvio con il profilo; l'indirizzo è `http://localhost:5080`.

```
dotnet run --project samples/Gallery --launch-profile Server
dotnet run --project samples/Gallery --launch-profile WebAssembly
dotnet run --project samples/Gallery --launch-profile Auto
```

Il profilo imposta `Gallery:RenderMode` (`Server`, `WebAssembly` o `Auto`; se assente vale `Server`). Un valore diverso ferma l'avvio. In Auto il primo accesso è eseguito sul server e, scaricati i file, quelli successivi usano WebAssembly.
