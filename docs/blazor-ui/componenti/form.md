---
title: Form
sidebar_position: 2
---

# Form

> Componente in fase di prototipo. La validazione e il momento in cui compaiono gli errori seguono per ora il comportamento del form di Blazor.

## `UiInputText`

Namespace `AngeloDotNet.Blazor.Ui.Forms`.

```razor
<EditForm Model="_contact" OnValidSubmit="SendAsync">
    <DataAnnotationsValidator />
    <UiInputText @bind-Value="_contact.Email" Label="Email" InputType="UiInputTextType.Email" Required="true" />
    <UiButton Type="UiButtonType.Submit">Invia</UiButton>
</EditForm>
```

Il campo funziona anche fuori da un `EditForm`, senza validazione. In entrambi i casi serve `@bind-Value`, oppure `Value`, `ValueChanged` e `ValueExpression`.

| Parametro | Default | Effetto |
|---|---|---|
| `Label` | obbligatorio | etichetta collegata al campo |
| `Hint` | nessuno | aiuto sotto il campo, sostituito dall'errore quando presente |
| `Size` | `Medium` | `Small` ha spazi ridotti, `Large` testo più grande |
| `Disabled`, `ReadOnly` | `false` | campo disabilitato o di sola lettura |
| `Required` | `false` | indica il campo come obbligatorio, a video e ai lettori di schermo; **non aggiunge controlli** |
| `Placeholder` | nessuno | testo di esempio; non sostituisce l'etichetta |
| `MaxLength` | nessun limite | caratteri digitabili; non sostituisce la validazione |
| `InputType` | `Text` | `Text`, `Email`, `Telephone`, `Url` |
| `UpdateOn` | `Change` | `Change`: all'uscita dal campo o con Invio; `Input`: a ogni modifica del testo |

Per `placeholder`, `required`, `readonly`, `maxlength` e `type` si usano i parametri qui sopra: il controllo sottostante riscrive gli attributi HTML con lo stesso nome.

Gli altri attributi, per esempio `id`, `autocomplete` o `data-*`, arrivano sull'elemento del campo. `class` va sul contenitore e `style` sul riquadro.

## Errori e accessibilità

Dentro un form i messaggi di validazione del campo compaiono sotto il campo, uniti se sono più d'uno. Il campo riceve `aria-invalid` e l'errore è collegato con `aria-describedby`, come l'aiuto. Senza `id` ne viene generato uno univoco.
