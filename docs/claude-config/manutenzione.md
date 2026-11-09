---
sidebar_position: 6
sidebar_label: Manutenzione
---

# Verifiche periodiche

- I nomi delle API citate nelle regole esistono ancora nelle versioni in uso (in particolare `AddOperationResult()` e `CreateResponse(result)` di `OperationResults` di Marco Minerva; namespace e firme vanno verificati a ogni uso).

- Licenze da verificare al primo uso (mai controllate in sessione): Coravel, Serilog e i suoi sink, MailKit, Scrutor, coverlet, ReportGenerator, NetArchTest o ArchUnitNET, axe, `RabbitMQ.Client`. Redis e RabbitMQ come servizi esterni: se la licenza non ti va più bene, l'alternativa BSD a Redis è Valkey.

- Licenza di Mailpit (SMTP di prova per test e sviluppo, servizio esterno già presente nell'infrastruttura, vedi `core.md` §3 e `backend-email.md`): da verificare al primo uso sul repository ufficiale.

- Le soglie di partenza sono ancora adatte: copertura 80%, p95 sotto 300 ms per le letture e sotto 1 s per le scritture, ultime 2 versioni dei browser.

- Il `CLAUDE.md` del template rispecchia i campi che compili davvero ogni volta.

# Risoluzione dei problemi

| Sintomo | Cosa controllare |
|---|---|
| Claude ignora una regola | Il modulo è in `.claude/rules/` ed è caricato? Verifica con `/context` (i moduli con `paths:` si caricano solo quando si tocca un file corrispondente). La regola è scritta con "sempre/mai" o con "preferisci"? Se la sessione è lunga, ripeti la regola o apri una sessione nuova. |
| Claude usa una libreria vietata (MediatR, AutoMapper, Hangfire, Quartz.NET) | Ricordagli il divieto; controlla che `core.md` e `backend.md` siano in `.claude/rules/`. |
| Conflitto tra un modulo e il progetto | Vale il `CLAUDE.md` di progetto. Se il conflitto non è chiaro, Claude deve chiedere. |
| Un modulo non si carica | Verifica che sia in `.claude/rules/` (non in `rules-optional/`) e, per `frontend`, `backend` e `docker`, che si sia letto o modificato un file corrispondente a `paths:`. |
| Le risposte non sono in italiano | La regola di lingua è in `core.md` §6 (codice in inglese, spiegazioni in italiano): controlla che `core.md` sia caricato. |
| Un hook blocca una scrittura che ritieni corretta | Se il pattern è legittimo, dichiaralo con una deroga `kit-allow: <id> — <motivo>` sulla stessa riga o su quella sopra (vedi [Plugin](plugin.md)). Per sospendere tutto il plugin: `claude plugin disable kit@claude-config`. |

# Punti aperti

- **Automazioni non configurate:** i divieti di `git push --force` e `--no-verify`, e il blocco di PR e rilasci senza la GitHub CLI dichiarata nel progetto, sono tecnici solo con il [plugin `kit`](plugin.md) installato; senza, valgono come regole scritte (`git.md`). Push e tag non sono bloccati. Restano fuori dal plugin: lint automatico dopo ogni modifica e `docker compose config` quando cambiano i file Docker. I segreti nei commit sono bloccati dal plugin (`guard-commands` e `guard-write`), ma non da uno scanner come `gitleaks`.
- **Moduli mancanti:** non esistono regole per un frontend Blazor né per il mobile (MAUI, Ionic + Capacitor, Flutter, React Native; la PWA è solo un'opzione nel `CLAUDE.md`; per il mobile c'è solo la sezione minima «Mobile» di `security.md`, con rimando a OWASP MASVS), né una sezione dedicata a Dapper (solo la regola di scelta in `backend.md` §1). Si creano come moduli ad hoc solo quando un progetto li richiede.

# Aggiornare il template

Le regole si modificano nel template (`.claude/rules/`, `.claude/rules-optional/`, `CLAUDE.md`), non nelle copie dei progetti: vale per i progetti nuovi. I progetti già avviati hanno la loro copia e si riallineano su richiesta (*"Riallinea le regole"*) o con `/kit:aggiorna-regole`.

- Ogni revisione di `core.md` e di `frontend.md` aggiorna versione e data nell'intestazione e aggiunge una sottosezione a `CHANGELOG.md`, sotto il titolo del giorno (un titolo `## AAAA-MM-GG` per giorno, con una sottosezione per intervento). Il controllo `rules-watch` del plugin confronta la versione di ogni modulo di regole con intestazione (per ora `core.md` e `frontend.md`) con quella del template, solo per i moduli che il progetto ha.
- Il template ha un repository su GitHub (`AngeloDotNet/claude-config`) con il flusso git flow: ogni modifica nasce da un branch `feature/` o `bugfix/` partito da `develop`, va in PR verso `develop` con squash, e `develop` va in `main` con una PR che usa un merge commit. Il plugin `kit` si aggiorna sulle macchine solo quando sale la sua versione (vedi [Plugin](plugin.md)).
- Una regola che vale solo per un progetto va nel suo `CLAUDE.md`, non nei moduli.
- Quando una libreria cambia (Angular, PrimeNG, `OperationResults`, FusionCache), rivedi le regole che la citano: Claude verifica la versione installata, ma le regole vanno tenute aggiornate.
- Una modifica agli script o a `hooks/hooks.json` del plugin `kit` raggiunge chi lo ha installato solo quando sale `version` in `plugins/kit/.claude-plugin/plugin.json`: alla versione si aggiunge la voce di rilascio in `CHANGELOG.md`, poi si esegue `claude plugin marketplace update claude-config` e `claude plugin update kit@claude-config` (vedi [plugin.md](plugin.md)). Prima del rilascio: `claude plugin validate`. Se cambia il comportamento dei hook, si aggiorna anche la pagina [Plugin](plugin.md): il sito non la genera dal codice. Lo stesso vale per i comandi `/kit:...` (cartella `plugins/kit/skills/`): se cambia il loro comportamento, si aggiorna la sezione «Comandi» della stessa pagina.
- Evita di far crescere i file: più sono lunghi, più alcune regole vengono trascurate. Se un modulo supera circa 200 righe, valuta di dividerlo.
