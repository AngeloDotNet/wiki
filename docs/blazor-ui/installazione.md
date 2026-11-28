---
title: Installazione e configurazione
sidebar_position: 2
---

# Installazione e configurazione

> Il pacchetto non è ancora stato pubblicato: per ora la libreria si usa con un riferimento al progetto. La [galleria](sviluppo.md#galleria) è una Blazor Web App con interattività su tutta l'applicazione. L'interattività per singola pagina (Server) e il WebAssembly autonomo sono stati provati a mano, in Chromium, con applicazioni di prova: non hanno test automatici.

## 1. Registrare i servizi

```csharp
builder.Services.AddAngeloUi();
```

In una Blazor Web App con WebAssembly o Auto la registrazione va fatta sia nel progetto server sia in quello client.

Le opzioni si impostano nella stessa chiamata (vedi [Tema](tema.md)):

```csharp
builder.Services.AddAngeloUi(options => options.Theme.BorderRadius = 10);
```

Un valore non valido ferma l'avvio.

## 2. Includere i file statici

### Blazor Web App

Nella pagina ospite (`App.razor`):

```razor
<head>
    <UiStyles />
</head>
<body>
    ...
    <UiScripts />
</body>
```

### WebAssembly autonomo

In `wwwroot/index.html` i componenti qui sopra non si possono usare. I file si indicano a mano: i fogli di stile nell'`head`, in quest'ordine, e lo script prima di quello di Blazor.

```html
<head>
    <link rel="stylesheet" href="_content/MudBlazor/MudBlazor.min.css" />
    <link rel="stylesheet" href="_content/AngeloDotNet.Blazor.Ui/ui.css" />
</head>
<body>
    ...
    <script src="_content/MudBlazor/MudBlazor.min.js"></script>
    <!-- qui lo script di Blazor del progetto -->
</body>
```

## 3. Inserire i provider

`<UiProviders />` applica il tema e ospita popover, dialog e notifiche. Va inserito **una sola volta, in un contesto interattivo**.

Con l'interattività su tutta l'applicazione, e nel WebAssembly autonomo, basta il layout:

```razor
@inherits LayoutComponentBase

<UiProviders />

@Body
```

Con l'interattività per singola pagina il layout è statico: si assegna il render mode al componente.

```razor
<UiProviders @rendermode="InteractiveServer" />
```

Il tema vale anche sulle pagine statiche. Questa configurazione è stata provata solo con `InteractiveServer`.
