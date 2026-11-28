---
title: Tema
sidebar_position: 4
---

# Tema

La libreria ha un tema chiaro e uno scuro. La preferenza può essere `Light`, `Dark` o `System`: con `System` il tema segue il dispositivo, anche mentre la pagina è aperta.

**Limite noto:** in modalità Server, se il tema del dispositivo cambia mentre il collegamento con il server è chiuso, nella console del browser può comparire un errore che la libreria non può intercettare. È stato riprodotto con Firefox durante il ricaricamento della pagina; il caso di un'interruzione di rete non è ancora stato verificato.

**Limite noto:** la pagina inviata dal server usa sempre il tema predefinito, perché il server non conosce il tema del dispositivo né la scelta salvata. Quando il tema da mostrare è diverso, per esempio con un dispositivo scuro, quello predefinito si vede finché la pagina diventa interattiva.

## Opzioni

```csharp
builder.Services.AddAngeloUi(options =>
{
    options.Theme.LightPalette = UiColorPalette.DefaultLight with { Primary = "#6D28D9" };
    options.Theme.FontFamilies = ["Inter", "sans-serif"];
});
```

I tipi del tema sono nel namespace `AngeloDotNet.Blazor.Ui.Theming`.

| Opzione (`options.Theme`) | Default | Valori ammessi |
|---|---|---|
| `DefaultMode` | `System` | `System`, `Light`, `Dark` |
| `LightPalette`, `DarkPalette` | colori della tabella sotto | colori in formato `#RRGGBB` |
| `BorderRadius` | `6` | da 0 a 32 pixel |
| `FontFamilies` | font di sistema | uno o più nomi senza virgolette, con lettere, cifre, spazi, trattini e trattini bassi |

I valori finiscono in un foglio di stile: quelli non validi fermano l'avvio. Un font indicato per nome deve essere caricato dall'applicazione; la libreria non scarica font.

## Colori predefiniti

| Ruolo | Chiaro | Scuro |
|---|---|---|
| `Primary` | `#1D4ED8` | `#60A5FA` |
| `Secondary` | `#475569` | `#94A3B8` |
| `Success` | `#15803D` | `#4ADE80` |
| `Warning` | `#B45309` | `#FBBF24` |
| `Danger` | `#B91C1C` | `#FA8282` |
| `Info` | `#0369A1` | `#38BDF8` |

Il testo sopra ciascun colore è bianco o `#0F172A`, scegliendo quello con il contrasto maggiore.

## Contrasto

Con i colori predefiniti, nei due temi, i test controllano queste soglie WCAG:

| Elemento | Soglia |
|---|---|
| testo sopra ciascun colore della tabella | 4,5:1 |
| testo principale, testo secondario e colori della tabella usati come testo, su sfondo e superfici | 4,5:1 |
| bordo dei campi, su sfondo e superfici | 3:1 |

Per rispettarle la libreria cambia tre valori di MudBlazor: il bordo dei campi nei due temi e, nel tema scuro, il testo secondario, usato per etichette e aiuti. Gli elementi disabilitati non sono controllati. Il controllo riguarda i colori del tema, non ogni combinazione mostrata dai componenti.

Con colori personalizzati il contrasto va controllato dall'applicazione.

## Leggere e cambiare la preferenza

Si usa `IUiThemeService`:

```razor
@inject IUiThemeService ThemeService

<button type="button" @onclick="() => ThemeService.SetModeAsync(UiThemeMode.Dark).AsTask()">...</button>
```

`ModeChanged` segnala i cambi. `UiProviders` carica la preferenza salvata dopo il primo rendering interattivo: prima di quel momento è mostrato il tema predefinito.

## Salvataggio

La preferenza è salvata in `localStorage`, chiave `angelo-ui.theme`. Se il browser nega l'accesso, vale solo per la sessione. Per salvarla altrove si registra una propria `IUiThemeStore`:

```csharp
builder.Services.AddScoped<IUiThemeStore, ProfileThemeStore>();
```
