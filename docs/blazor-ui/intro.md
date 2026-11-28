---
title: Introduzione
sidebar_position: 1
---

# Blazor UI

`AngeloDotNet.Blazor.Ui` è una libreria Blazor di componenti astratti, con MudBlazor come libreria UI di partenza. Il codice è nel repository [fe-blazor-components](https://github.com/AngeloDotNet/fe-blazor-components).

:::info Progetto in fase di avvio
Ci sono la struttura iniziale, il tema, i testi in italiano e inglese e, come prototipi, `UiButton` e `UiInputText`; nessun pacchetto è stato pubblicato. Il tema e i due componenti sono stati provati in Chromium, Firefox e WebKit. Salvo dove indicato, questa pagina descrive l'obiettivo, non funzionalità già disponibili.
:::

## Obiettivo

Le applicazioni che usano la libreria lavorano solo con componenti `Ui*` e servizi propri, con API semantiche. Le API pubbliche non espongono tipi MudBlazor. Unica eccezione nella versione 1: le icone, passate come `string` con `Icons.Material.*`.

## Funzionalità previste

- **Azioni e form:** pulsanti, campi di input, scelte, date e ore, selezione di file, validazione tramite `EditForm`.
- **Feedback:** messaggi, skeleton, avanzamento, notifiche, richieste di conferma.
- **Dati:** tabella (dati locali o dal server, export CSV), vista lista o griglia, albero, paginatore.
- **Overlay, navigazione e layout:** dialog, drawer, menu, breadcrumb, tab, stepper, card, struttura dell'applicazione.
- **Componenti compositi:** form builder tipizzato, barra di ricerca, stato vuoto, conferma con motivo.
- **Trasversali:** tema chiaro, scuro o di sistema; testi in italiano (default) e inglese, sostituibili dall'applicazione.

## Stack previsto

| Elemento | Scelta |
|---|---|
| Framework | .NET 10, Blazor (Interactive Server, WebAssembly e Auto) |
| Libreria UI | MudBlazor |
| Browser | versioni correnti di Chrome, Edge, Firefox e Safari, desktop e mobile |
| Test | xUnit v3, bUnit, Playwright per .NET |
| Distribuzione | pacchetti NuGet su un feed self-hosted |

I pacchetti previsti sono `AngeloDotNet.Blazor.Ui` e, facoltativo, `AngeloDotNet.Blazor.Ui.FluentValidation`.

## Avvio rapido

Per provare la libreria si avvia la galleria (serve l'SDK .NET 10, vedi `global.json`):

```
dotnet run --project samples/Gallery --launch-profile Server
```

Poi si apre `http://localhost:5080`.

![La galleria avviata in modalità Server: titolo e pulsanti Sistema, Chiaro e Scuro per scegliere il tema](/img/blazor-ui-galleria.png)

*La galleria permette di provare il tema e, nella pagina «Componenti», quelli realizzati finora.*

## Dove continuare

- [Installazione e configurazione](installazione.md): servizi, file statici, `UiProviders`.
- [Azioni](componenti/azioni.md): `UiButton`.
- [Form](componenti/form.md): `UiInputText`.
- [Tema](tema.md): opzioni, colori, preferenza dell'utente.
- [Lingue e testi](localizzazione.md): italiano, inglese, sostituzione dei testi.
- [Sviluppo in locale](sviluppo.md): comandi, struttura del progetto, galleria.

La documentazione degli altri componenti sarà aggiunta insieme ai componenti.
