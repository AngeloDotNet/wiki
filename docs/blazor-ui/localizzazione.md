---
title: Lingue e testi
sidebar_position: 5
---

# Lingue e testi

I testi della libreria sono in **italiano** (predefinito, usato anche per le lingue non disponibili) e in **inglese**. La lingua segue `CultureInfo.CurrentUICulture`, che è impostata dall'applicazione. La [galleria](sviluppo.md#galleria) mostra un esempio in cui segue la lingua del browser.

## Sostituire i testi

Si registra un `IUiTextProvider` (namespace `AngeloDotNet.Blazor.Ui.Localization`), che restituisce `null` per i testi da lasciare invariati:

```csharp
public sealed class AppTexts : IUiTextProvider
{
    public string? GetText(string key, CultureInfo culture) =>
        key == "Dialog_Close" && culture.TwoLetterISOLanguageName == "it" ? "Esci" : null;
}

builder.Services.AddScoped<IUiTextProvider, AppTexts>();
```

- Se si registrano più provider, vale solo l'ultimo.
- I segnaposto come `{0}` vanno mantenuti. Un testo con segnaposto errati viene ignorato e si usa quello predefinito.
- I testi sono mostrati come testo: l'eventuale HTML non viene interpretato.

Le chiavi sono elencate in [`UiResources.resx`](https://github.com/AngeloDotNet/fe-blazor-components/blob/main/src/AngeloDotNet.Blazor.Ui/Localization/UiResources.resx).
