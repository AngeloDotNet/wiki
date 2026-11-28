---
title: Azioni
sidebar_position: 1
---

# Azioni

> Componente in fase di prototipo.

## `UiButton`

Namespace `AngeloDotNet.Blazor.Ui.Actions`; `UiVariant` e `UiSize` stanno in `AngeloDotNet.Blazor.Ui`.

```razor
<UiButton Variant="UiVariant.Danger" Icon="@Icons.Material.Filled.Delete" OnClick="DeleteAsync">Elimina</UiButton>
```

| Parametro | Default | Effetto |
|---|---|---|
| `ChildContent` | | testo del pulsante |
| `Variant` | `Primary` | `Primary`, `Secondary`, `Danger`, `Ghost` (senza sfondo) |
| `Size` | `Medium` | `Small`, `Medium`, `Large` |
| `Icon`, `IconPosition` | nessuna, `Start` | icona (`Icons.Material.*`) prima o dopo il testo |
| `Loading` | `false` | caricamento deciso dall'applicazione |
| `AutoLoading` | `true` | caricamento mentre il metodo di `OnClick` è in corso |
| `Disabled` | `false` | pulsante disabilitato |
| `FullWidth` | `false` | tutta la larghezza disponibile |
| `Type` | `Button` | `Button`, `Submit`, `Reset` |
| `OnClick` | | azione al clic |

Il testo è mostrato come è scritto, senza maiuscole forzate.

Gli altri attributi, per esempio `class`, `style` o `aria-label`, arrivano sul pulsante. Un pulsante con la sola icona richiede `aria-label`.

## Caricamento

Durante il caricamento il pulsante è disabilitato, ha `aria-busy` e al posto dell'icona mostra un indicatore. I clic ripetuti non rieseguono l'azione. Se il metodo termina con un errore, il caricamento finisce e l'errore prosegue normalmente. Per un'operazione avviata dall'invio di un form si usa `Loading`.
