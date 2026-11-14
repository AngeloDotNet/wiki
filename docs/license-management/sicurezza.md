---
title: Sicurezza
sidebar_position: 3
---

# Sicurezza

Il servizio non gestisce password né sessioni: verifica solo i token JWT emessi da Keycloak. Il livello di riferimento è OWASP ASVS 2. Decisioni e threat model sono nell'ADR `docs/adr/0001-autenticazione-e-autorizzazione.md` del repository.

## Chi accede e come

| Chi | Come | Cosa ottiene |
| --- | --- | --- |
| App SaaS | client credentials con scope `licensing.read` | lettura degli entitlements |
| Pannello admin | OIDC (code + PKCE), scope `licensing.write`, ruolo `license-admin` e MFA | gestione di prodotti, piani, account, membri e licenze |

Ogni endpoint richiede l'autenticazione (*fail closed*): una richiesta senza token valido riceve 401, una con token valido ma senza i permessi richiesti riceve 403.

## Validazione dei token

- Firma verificata con le chiavi pubbliche (JWKS) di Keycloak, solo RS256 o ES256.
- Controllo di `iss`, `aud` (`licensing-api`) ed `exp`, con tolleranza di orario di 30 secondi.
- Il ruolo `license-admin` si legge da `resource_access.licensing-api.roles`; i ruoli di altri client sono ignorati.
- La MFA si verifica dal claim `amr`; i valori accettati sono configurabili.

## Protezioni dell'API

- Accesso solo tramite il reverse proxy con TLS; i proxy fidati per `X-Forwarded-*` sono espliciti.
- CORS con elenco esplicito di origini; header di sicurezza e `Cache-Control: no-store` sulle risposte autenticate; HSTS fuori da Development.
- Limiti di frequenza per client (entitlements 600 al minuto, gestione 120 al minuto) con risposta 429 e `Retry-After`.
- Corpo delle richieste limitato a 64 KB, paginazione con massimo di 100 elementi, ordinamento solo su campi ammessi.
- Nessun dettaglio interno negli errori: le eccezioni escono come `ProblemDetails` generico con chiave `ERROR_INTERNAL`.
- Fuori da Development l'avvio fallisce se la configurazione è mancante o ancora a segnaposto.

## Da predisporre su Keycloak

A cura dell'amministratore dell'istanza:

- il client `licensing-api` con il ruolo `license-admin`;
- gli scope `licensing.read` e `licensing.write`;
- un client confidenziale per ogni app SaaS;
- un client pubblico per il pannello;
- un flusso che richiede la MFA agli amministratori ed emette il claim `amr`.

Emissione di `amr`, audience e ruoli vanno ancora verificate sul Keycloak reale: i test usano token simulati.
