---
title: Mappa e posizione
sidebar_position: 12
---

# Mappa e posizione

Un evento può avere un indirizzo e una posizione (latitudine e longitudine), entrambi facoltativi. Quando la posizione c'è, il dettaglio dell'evento mostra il punto su una mappa.

## Cosa si vede

- **Nel dettaglio:** la riga «Indirizzo» (se indicato), la mappa con il segnaposto e il testo con le coordinate, che resta leggibile anche se la mappa non si carica. Il pulsante «Apri la mappa» apre Google Maps sul punto esatto; senza posizione apre la città.
- **Nel modulo di segnalazione e modifica:** la mappa si sposta toccandola o trascinando il segnaposto. Il pulsante «Trova sulla mappa» cerca l'indirizzo insieme alla città e sposta il punto sul primo risultato. Il modulo mostra il nome del luogo trovato, così si può controllare; il pulsante è attivo solo con la città indicata.
- **Senza posizione:** il salvataggio è possibile e l'evento non ha la mappa.

Le coordinate si accettano con al massimo 6 decimali, latitudine tra -90 e 90 e longitudine tra -180 e 180. Latitudine e longitudine vanno indicate insieme o lasciate entrambe vuote.

## Servizi esterni

La mappa usa tre servizi:

- **OpenStreetMap**, per le tile dello sfondo (`tile.openstreetmap.org`), sempre quando la mappa è visibile;
- **Nominatim**, per la ricerca degli indirizzi (`nominatim.openstreetmap.org`), solo quando l'utente preme «Trova sulla mappa»;
- **Google Maps**, solo quando l'utente apre il link «Apri la mappa».

Il browser invia a questi servizi l'indirizzo IP del dispositivo e, nella ricerca, il testo digitato. Le tile e la ricerca seguono le condizioni d'uso di OpenStreetMap: la ricerca è limitata a una richiesta al secondo, i risultati restano in memoria finché la pagina è aperta, e le tile non vengono salvate per l'uso offline.

La mappa mostra l'attribuzione di OpenStreetMap in basso.

## Offline

Senza rete le tile non si caricano: la mappa resta vuota, ma le coordinate restano scritte. La ricerca non funziona e il pulsante «Trova sulla mappa» segnala che il servizio non è disponibile. Il salvataggio di un evento resta possibile senza posizione.

## Configurazione

I servizi della mappa stanno nella sezione `mappa` di `public/config.json`, letta all'avvio del client. Si cambiano senza ricompilare l'app:

```json
{
  "apiBaseUrl": "",
  "mappa": {
    "tileUrl": "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    "nominatimUrl": "https://nominatim.openstreetmap.org/search"
  }
}
```

| Impostazione | Descrizione |
| --- | --- |
| `mappa.tileUrl` | Modello degli URL delle tile, con i segnaposto `{z}`, `{x}` e `{y}`. Deve iniziare con `https://` |
| `mappa.nominatimUrl` | Endpoint di ricerca compatibile con Nominatim. Deve iniziare con `https://` |

Un valore non valido (per esempio `http://`, un URL senza `{z}`, `{x}` o `{y}`) viene ignorato e resta il servizio predefinito.

Se si cambia provider e la Content-Security-Policy del reverse proxy è attiva, il nuovo dominio delle tile va ammesso in `img-src` e quello della ricerca in `connect-src`; altrimenti le tile o la ricerca restano bloccate senza un messaggio esplicito, e resta solo il testo con le coordinate.

## Accessibilità

La mappa ha un'etichetta che indica l'evento (per esempio «Posizione di …»). Le coordinate sono anche testo nella pagina, quindi il punto si legge con lo screen reader senza usare la mappa.
