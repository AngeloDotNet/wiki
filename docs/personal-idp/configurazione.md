---
title: Configurazione
sidebar_position: 3
---

# Configurazione

## Posta (SMTP)

`Coravel:Mail:Host` è obbligatorio: senza, l'applicazione non si avvia e l'errore nomina la chiave mancante. Porta, utente e password SMTP si impostano con le chiavi `Coravel:Mail:*`. La porta di sviluppo è in `appsettings.Development.json`, e un secret `Coravel:Mail:Port` ha la precedenza su di essa.

## Opzioni validate all'avvio

Le sezioni `Mfa` e `Password` sono validate all'avvio. Un valore non valido blocca l'avvio, e il messaggio di errore indica la chiave da correggere.

## Scadenza della password

La chiave `Password:MaxAgeDays` in `appsettings.json` controlla la durata della password:

- `0` (valore predefinito): nessuna scadenza.
- Un valore maggiore di zero: una password più vecchia obbliga al cambio. Il login e `/connect/authorize` portano alla pagina di cambio password, e il refresh token restituisce `invalid_grant`.

## Sessione della console

La console usa il cookie di sessione del login. Due valori ne fissano la durata, nella sezione `Session` di `appsettings.json`:

- `Session:IdleMinutes` (predefinito `30`): scadenza per inattività.
- `Session:AbsoluteHours` (predefinito `8`): durata massima dalla data di accesso, anche con uso continuo.

Le richieste `/api` senza sessione valida ricevono `401` o `403`, non un redirect alla pagina di login.

## Origini della SPA

La sezione `Spa:AllowedOrigins` elenca le origini della console. Solo queste origini ricevono il CORS con credenziali, e solo verso di loro il login Razor può tornare con `returnUrl`. In `appsettings.json` la lista è vuota; in `appsettings.Development.json` contiene `http://localhost:4200` e `https://localhost:4200`, per `npm run start:https` (la console è su HTTPS). In produzione va impostata con un'origine esatta, per esempio `https://<host-console>`.

## Permessi

I permessi sono righe della tabella dei permessi, non più un elenco fisso nel codice. All'avvio il seed inserisce i permessi di sistema mancanti, che non si cancellano. Un permesso personalizzato si crea dalla console o dalle API admin, con un nome nella forma `area.azione` (per esempio `reports.export`). Il nome è fisso: per cambiarlo si cancella e si ricrea. La cancellazione è possibile solo se nessun ruolo lo usa. Il ruolo `admin` riceve tutti i permessi.

Un endpoint protetto dal nome di un permesso funziona anche per permessi creati dopo l'avvio, senza modificare il codice.

## Autenticazione a due fattori

Il secondo fattore (TOTP) è obbligatorio per tutti gli utenti, anche per l'amministratore di bootstrap e per gli utenti creati dalle API (ADR 0009).

- **Primo accesso senza MFA:** dopo una password corretta non si ottiene una sessione. La pagina `/Account/MfaSetup` mostra la chiave da inserire nell'app di autenticazione e chiede il codice. Il passaggio è protetto da un cookie di setup a vita breve, che vale solo per la configurazione dell'MFA.
- **Attivazione completata:** con un codice valido l'accesso è completato e vengono generati i codici di recupero, da conservare per il caso in cui il dispositivo non sia disponibile.
- **Login successivi:** dopo la password il login chiede il codice TOTP o un codice di recupero.
- **Reimpostazione da amministratore:** un amministratore può reimpostare il secondo fattore di un utente dalle API admin; al login successivo l'utente torna alla configurazione.

Gli account esistenti senza MFA vedono la configurazione al prossimo login con password corretta.

## Localizzazione dei messaggi

Il backend non invia testi ai client: invia chiavi, per esempio `ERROR_USER_NOT_FOUND` o `ERROR_IDENTITY_PASSWORD_TOO_SHORT`. I testi stanno nella tabella dei testi tradotti, con le lingue `it` ed `en`. All'avvio il seed allinea il catalogo al database: l'operazione è idempotente, quindi dopo una modifica al catalogo basta riavviare l'applicazione.

Le pagine traducono i messaggi con la lingua del profilo dell'utente. I visitatori anonimi vedono l'italiano.

Endpoint pubblico:

- `GET /api/localization/dictionary?lang=it`: restituisce tutte le chiavi della lingua, con `ETag`. Con `If-None-Match` uguale risponde `304`. Una lingua non supportata risponde `400` con `ERROR_LOCALE_NOT_SUPPORTED`.

La migrazione `AddLocalization` va applicata prima di usare la localizzazione.
