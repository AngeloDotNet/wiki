---
sidebar_position: 3
sidebar_label: Plugin kit
---

# Plugin `kit`

Il repository è anche un **marketplace** di Claude Code (`claude-config`) che contiene il plugin `kit`: dodici hook personali che fanno rispettare in modo tecnico alcune regole del template e tengono Claude allineato alle regole aggiornate. Il plugin si installa una volta per macchina e vale per tutti i progetti; alcuni controlli valgono solo nei progetti che hanno `.claude/rules/core.md` (vedi [Attivazione](#attivazione)). Le regole (`.claude/rules/`) non fanno parte del plugin e si copiano nei progetti come descritto in [Come si usa](uso.md). Dalla versione 1.9.0 il plugin aggiunge anche sedici comandi `/kit:...` (sezione [Comandi](#comandi)).

## Cosa contiene

I dodici hook si dividono in tre famiglie:

- **blocchi**: fermano l'operazione; Claude riceve il motivo e deve correggere;
- **avvisi**: l'operazione passa; Claude e l'utente ricevono un avviso da correggere nel passo successivo;
- **promemoria**: ricordano una regola a inizio o fine sessione, senza bloccare.

### Blocchi

| Hook | Evento | Cosa fa |
|---|---|---|
| `limit-one-question` | `PreToolUse` su `AskUserQuestion` | Blocca le chiamate con più di una domanda. |
| `guard-commands` | `PreToolUse` su `Bash` e `PowerShell` | Blocca sempre `git init`, `git push --force` e varianti, la cancellazione di branch remoti, `reset --hard`, `clean -f`, `--no-verify`, `rm -rf`, e blocca `git push`, la creazione di tag, `gh pr create/merge` e `gh release` in scrittura finché il progetto non li approva (vedi [Integrazione GitHub](#integrazione-github)). Blocca anche i commit su `main`/`develop` (con l'istruzione di proporre un branch da `develop`), `git add -A`, `git add --all` e `git add .`, l'aggiunta di file sensibili (`.env` non `.env.example`, `secrets.json`, `*.pfx`, `*.p12`, `*.key`, `*.pem`, `*.jks`) e i commit con messaggio non conforme a Conventional Commits (oggetto di al massimo 72 caratteri, descrizione minuscola, senza punto finale). |
| `guard-secrets` | `PreToolUse` su `Write`, `Edit`, `MultiEdit` | Blocca la scrittura di segreti reali: valori in chiavi come `Password`, `Secret`, `Token`, `Key` o password in una stringa di connessione dentro `appsettings*.json`; password in chiaro in `docker-compose*.yml` e `Dockerfile`; chiavi private PEM, chiavi AWS e token JWT completi. Un segnaposto (`CHANGE-ME…`, `${VAR}`, `placeholder…`) passa solo se il valore intero ha quella forma: una parola come `example` dentro un valore non basta. I token JWT non si controllano nei file `.md`, dove la documentazione li usa come esempio. |
| `guard-patterns` | `PreToolUse` su `Write`, `Edit`, `MultiEdit` | Blocca undici pattern vietati dalle regole: test saltati (`skip`, `Ignore`, `.only`), attese arbitrarie nei test (`Task.Delay`, `Thread.Sleep`), Angular legacy (NgModule, `*ngIf`, `*ngFor`), librerie vietate (MediatR, AutoMapper, Jest, Karma, Jasmine), EF Core InMemory, API insicure (`AllowAnyOrigin`, `BinaryFormatter`, MD5/SHA1, `eval`), SQL interpolato (`FromSqlRaw($"...")`), `npm install` o `npm ci` senza `--ignore-scripts` nel Dockerfile, TLS disattivato in `appsettings*.json`, `NoWarn` di progetto nei `.csproj` e `.props`, `catch` con blocco vuoto. Ammette le deroghe [`kit-allow`](#deroghe-kit-allow). |

### Avvisi

| Hook | Evento | Cosa fa |
|---|---|---|
| `check-plan` | `PostToolUse` su `Write`, `Edit`, `MultiEdit` (solo per `PIANO.md`) | Segnala un passo spuntato `[x]` che non riporta l'esito di build e di test (`core.md` §6.21). |
| `check-quality` | `PostToolUse` su `Write`, `Edit`, `MultiEdit` | Avvisa su Docker (immagini senza tag o con `latest`, porte host di database e broker esposte), su dipendenze (range di versione `*` e `latest` in `package.json`; `^` e `~` non si segnalano più; promemoria di `npm audit` o `dotnet list package --vulnerable` quando cambiano i pacchetti) e sul frontend (`any`, `innerHTML`, `bypassSecurityTrust*`, colori esadecimali hardcoded: nei `.ts` solo tra virgolette, nei `.html` solo dentro `style`). |
| `check-practice` | `PostToolUse` su `Write`, `Edit`, `MultiEdit` | Avvisa su scritture in blocco (`ExecuteUpdate`, `ExecuteDelete`), soppressioni di analyzer senza motivo, endpoint `AllowAnonymous`, `Regex` senza `matchTimeout`, `console.log` e `Console.Write` nel codice, membri pubblici C# senza commento `///`, file nuovo di servizio (`*Service`, `*Handler`, `*Validator`, `.service.ts`, `.component.ts`, `.pipe.ts`) senza test. Ammette le deroghe `kit-allow`. |

### Promemoria

| Hook | Evento | Cosa fa |
|---|---|---|
| `ask-one-question` | `UserPromptSubmit` | A ogni messaggio ricorda la regola "nel dubbio, una domanda alla volta" (`core.md`, sezione in testa). |
| `rules-watch` | `UserPromptSubmit` | A ogni messaggio controlla se le regole del progetto sono cambiate durante la sessione (per esempio dopo un `git pull`) e, se sì, ordina di rileggere i file cambiati allegando il `git diff`. Una volta per sessione confronta anche le regole con quelle del template. |
| `session-plan` | `SessionStart` (`startup`, `resume`, `clear`, `compact`) | A inizio sessione inserisce `PIANO.md` del progetto (se esiste) e l'elenco delle regole cambiate dall'ultima sessione, con il `git diff` dei file cambiati se la cartella è un repository. |
| `plan-reminder` | `Stop` | A fine sessione, se `PIANO.md` ha ancora passi con casella `[ ]` o `[~]`, lo segnala all'utente. |
| `check-close` | `Stop` | A fine sessione, sulle modifiche non ancora committate, ricorda: codice modificato senza `CHANGELOG.md` aggiornato, modello EF cambiato senza una nuova migrazione, chiavi `it.json` ed `en.json` diverse. Usa `git status`. |

Il blocco dei comandi vietati è assoluto: chi vuole un'eccezione esegue il comando a mano (prefisso `!` nel prompt) oppure disattiva il plugin. Le operazioni di integrazione (push, PR, tag, rilasci) si sbloccano invece con l'approvazione del progetto, descritta sotto.

`session-plan` e `rules-watch` salvano le impronte delle regole (`CLAUDE.md` e `.claude/rules/*.md`) in `~/.claude/session-rules-state.json` (una voce per cartella di progetto, più l'hash di `HEAD` e un marcatore di sessione). Gli script richiedono Node.js; il diff richiede anche `git`. Un hook non può obbligare Claude a rileggere i file: inserisce nel contesto l'ordine di farlo.

## Comandi

Il plugin aggiunge sedici comandi, che si lanciano digitando `/kit:` seguito dal nome. Non partono mai da soli: sono impostati perché solo l'utente li possa lanciare, e scrivono file solo quando li lanci tu.

| Comando | Cosa fa | Scrive file |
|---|---|---|
| `/kit:buongiorno` | All'inizio della giornata rilegge `PIANO.md` e `CHECKLIST.md`, riassume dove si è arrivati, cosa fare e le priorità, e propone il primo passo. Attende il tuo ok. | No |
| `/kit:buonasera` | A fine giornata salva in `PIANO.md` lo stato dei lavori (passi completati, prossimo passo, decisioni aperte, file toccati, test rotti) e aggiunge i nuovi problemi in `CHECKLIST.md`. Stampa il prompt per la sessione successiva. Non salva la conversazione. | Sì (`PIANO.md`, `CHECKLIST.md`) |
| `/kit:avvia-progetto` | Avvia un progetto nuovo: fa le domande di avvio una per messaggio e compila il `CLAUDE.md`. | Sì (`CLAUDE.md`) |
| `/kit:copia-regole` | Copia le regole del template in un progetto che non le ha, con i moduli scelti in conversazione. | Sì (regole e file di root) |
| `/kit:aggiorna-regole` | Confronta le regole di un progetto con il template e propone gli aggiornamenti. Ogni file diverso si sovrascrive solo con la tua conferma, e il vecchio resta come `.bak`. | Sì, solo con conferma |
| `/kit:consegna` | Passa la checklist di consegna (`core.md` §0b) sul lavoro corrente e segnala le voci mancanti. | No |
| `/kit:code-review` | Revisione del codice contro le regole di `.claude/rules/`. Integra il controllo integrato di Claude Code, non lo sostituisce. | No |
| `/kit:aggiorna-docs` | Aggiorna `README.md` e `CHANGELOG.md` del progetto, crea il `README.md` se manca, e, se esiste, il sito di documentazione esterno. Scrive la voce di rilascio nel `CHANGELOG.md` solo su richiesta. | Sì |
| `/kit:verifica` | Esegue i controlli di una soluzione .NET (ripristino, build in Release, test, pacchetti vulnerabili, modello EF senza migrazione, spazi bianchi) e riporta l'esito reale, senza correggere nulla. | No (solo cartelle di build) |
| `/kit:qualita-test` | Revisiona i test cercando falsa sicurezza, fragilità e duplicati, e propone test xUnit parametrici e leggibili. | No |
| `/kit:dati-efcore` | Guida il lavoro con Entity Framework Core: letture senza tracking, migrazioni, ciclo di vita del `DbContext`, ottimizzazione delle query. | No |
| `/kit:accessi-api` | Guida autenticazione e autorizzazione di un'API ASP.NET Core: schemi, policy, handler, scope e claim. | No |
| `/kit:gdpr-dati` | Revisiona il backend rispetto ai principi GDPR (minimizzazione, conservazione, log, diritti degli interessati). Non è consulenza legale. | No |
| `/kit:accessibilita-ui` | Revisiona l'accessibilità dell'interfaccia rispetto a WCAG 2.2, con una gravità per ogni problema. Le correzioni si chiedono con una richiesta separata. | No |
| `/kit:colori-tema` | Costruisce o verifica la palette per i temi chiaro e scuro, con il contrasto misurato sui valori resi. | No |
| `/kit:localizzazione` | Verifica il layout per testi tradotti più lunghi, orientamento RTL, ordine di lettura e zoom. | No |

Due note pratiche:

- Il percorso del sito di un progetto, e la scelta di gestire o no le priorità, si chiedono una volta per progetto e si salvano in `~/.claude/kit-progetti.json`, sulla tua macchina e fuori dai repository. Il file non va copiato così com'è su un altro computer: i percorsi cambiano.
- Lo script Windows `copia-regole.bat` non c'è più: `/kit:copia-regole` e `/kit:aggiorna-regole` ne fanno il lavoro, passando da Claude, che chiede una domanda alla volta.

## Attivazione

- **In ogni progetto:** `guard-commands`, `guard-secrets`, `check-quality`, `check-plan`, `plan-reminder`, `session-plan`, `rules-watch`, `ask-one-question`, `limit-one-question`.
- **Solo nei progetti con `.claude/rules/core.md`:** `guard-patterns`, `check-practice`, `check-close`. Il file è il segno che il progetto usa le regole del template; senza di esso questi tre hook non fanno nulla.

## Deroghe `kit-allow`

Quando un pattern è giusto in un caso preciso, la deroga si scrive nel codice, sulla stessa riga o su quella sopra, con l'id della regola e un motivo di almeno otto caratteri:

```
// kit-allow: skip — rimandato alla CI notturna
```

- Per `guard-patterns` gli id sono: `skip`, `angular-legacy`, `libreria-vietata`, `inmemory`, `api-vietata`, `sql-interpolato`, `npm-install`, `tls-disattivato`.
- Per `check-practice` gli id sono: `scrittura-blocco`, `soppressione`, `anonimo`, `regex`, `log`.
- Un id sbagliato o un motivo vuoto o troppo corto non bastano: il blocco o l'avviso resta.
- `guard-commands`, `guard-secrets` e `limit-one-question` non hanno deroghe.

Ogni deroga aggiunta in una pull request è elencata dal controllo CI `kit-allow` (il workflow d'esempio è in `_template/ci/`), con file e riga, e va approvata in review come ogni eccezione (`core.md` §6, punto 23).

## Integrazione GitHub

Push, PR, tag e rilasci passano solo se il progetto li ha approvati. L'approvazione è una riga fissa nel `CLAUDE.md` del progetto, nella sezione «Eccezioni alle regole globali»:

```
- **Integrazione GitHub approvata:** PR sì, push no, tag sì, rilasci no (2026-11-04)
```

- Ogni operazione è sbloccata separatamente. La data in fondo è facoltativa.
- Senza la riga, o con una riga in un altro formato, nessuna operazione è sbloccata: il blocco resta.
- La riga si legge dal `CLAUDE.md` della radice del repository, anche se il comando parte da una sottocartella. Fuori da un repository si legge quello della cartella del comando.
- Anche con approvazione restano sempre bloccati `git push --force` (e varianti), la cancellazione di branch remoti, `reset --hard`, `clean -f`, `--no-verify` e `git init`.
- Le domande a Claude (se la GitHub CLI è installata e autenticata, quali operazioni approvare) sono nella regola `git.md`, non nel hook.

## Limiti dei controlli

- I controlli leggono il testo che Claude scrive con `Write`, `Edit` e `MultiEdit`. Non vedono le modifiche fatte da Bash, per esempio con `sed` o con una redirezione.
- Con `Edit` il hook vede solo il testo nuovo: se una modifica tocca una riga che ha già una deroga, la deroga va ripetuta nella modifica.
- I controlli sul C# sono espressioni regolari, non un parser: membri su più righe o attributi complessi possono sfuggire o dare falsi positivi.
- Gli avvisi non fermano il lavoro; i blocchi sì. Una falsa positività su un blocco si risolve con una deroga, non disattivando il hook.

## Test degli hook

```
node --test "plugins/kit/tests/*.test.mjs"
```

I test usano cartelle temporanee e una home finta (non toccano `~/.claude`); i casi con git clonano questo repository, quindi vanno eseguiti al suo interno. I casi che clonano il repository (`rules-watch.test.mjs`) copiano le regole nel clone se non sono ancora committate, quindi passano anche prima del primo commit.

## Installazione

Una volta per macchina:

```
claude plugin marketplace add <percorso o repository del template>
claude plugin install kit@claude-config
```

- **Da cartella locale:** `<percorso>` è la cartella del template (quella con `.claude-plugin/`).
- **Da GitHub:** `AngeloDotNet/claude-config`.
- **Dal nome `kit-config`:** il plugin si chiamava `kit-config` fino alla rinomina in `kit` (commit `ae66ee1`). Chi lo aveva installato con il nome vecchio deve installare `kit@claude-config` e rimuovere `kit-config`; poi riavviare Claude Code, perché gli hook vengono caricati all'avvio della sessione.

In una sessione già aperta, `/reload-plugins` carica gli hook senza riavviare. Con `claude plugin list` si verifica che `kit@claude-config` sia `enabled`.

## Aggiornamento

Il plugin ha una `version` esplicita in `plugins/kit/.claude-plugin/plugin.json`: chi lo ha installato riceve le modifiche solo quando la versione sale. Dopo aver aggiornato il template (da cartella locale: `git pull`):

```
claude plugin marketplace update claude-config
claude plugin update kit@claude-config
```

Con la versione 1.9.0 arrivano anche i comandi `/kit:...`: dopo l'aggiornamento, `/reload-plugins` (o una nuova sessione) li rende disponibili, e `claude plugin details kit@claude-config` ne elenca sedici nella riga «Skills».

Il procedimento per chi mantiene il template è in [Manutenzione](manutenzione.md).

## Regole aggiornate: cosa controlla `rules-watch`

- **Regole cambiate nella sessione.** Se un file di regole cambia (o viene aggiunto o rimosso) tra un messaggio e l'altro, Claude riceve l'elenco e l'ordine di rileggerlo. Il promemoria compare una volta sola per modifica; se nulla è cambiato, nessun testo in più.
- **Diff con git.** In un repository l'avviso include il `git diff` dei soli file cambiati, calcolato dall'hash di `HEAD` salvato (commit successivi e modifiche non committate). Il diff è troncato e, a inizio sessione, limitato in modo che l'output resti sotto i 10.000 caratteri. Senza git, o con un hash non valido, resta l'elenco dei file. I file nuovi non tracciati compaiono nell'elenco ma non nel diff.
- **Regole del template più recenti.** Una volta per sessione e per progetto, `rules-watch` confronta la versione di `core.md` del progetto con quella del template. Se il template è più avanti, Claude riceve versioni e file diversi e deve proporti l'allineamento con una sola domanda: non copia nulla senza il tuo ok. Una differenza di contenuto a parità di versione non viene segnalata (potrebbe essere una deroga voluta, da annotare in `CLAUDE.md`).
- **Cartella del template.** Si legge dalla variabile d'ambiente `KIT_CONFIG_TEMPLATE_DIR`, da impostare una volta per macchina con il percorso della cartella del template (per esempio nella sezione `env` di `~/.claude/settings.json`). Il plugin non ha un percorso di default: senza la variabile il confronto non parte e Claude riceve un avviso che chiede il percorso. Se la cartella non esiste o non contiene `.claude/rules`, Claude riceve un avviso (una volta per sessione) e ti chiede il percorso corretto. Il confronto è saltato nel template stesso e nei progetti senza file di regole.

## Spostare la cartella locale del marketplace

Se il marketplace è stato aggiunto da cartella locale e la cartella cambia posto (o se ne usa un'altra copia del repository), il percorso registrato va aggiornato: `claude plugin marketplace update` non lo fa. Il percorso compare in `extraKnownMarketplaces` di `~/.claude/settings.json` e in `~/.claude/plugins/known_marketplaces.json` (gestito da Claude Code): si modifica con la CLI, non a mano.

```
claude plugin marketplace remove claude-config
claude plugin marketplace add <nuovo percorso> --scope user
claude plugin install kit@claude-config --scope user
```

Poi `/reload-plugins` (o un riavvio) e `claude plugin list` per verificare che `kit@claude-config` sia `enabled`.

`remove` **disinstalla anche il plugin** e cancella, dove possibile, le sue opzioni e i suoi dati salvati: per questo serve la reinstallazione. `session-rules-state.json` non ne risente. Il plugin già installato è una copia in `~/.claude/plugins/cache/`, quindi non dipende dalla vecchia cartella finché non si esegue `remove`.

## Disattivazione e disinstallazione

```
claude plugin disable kit@claude-config
claude plugin uninstall kit@claude-config
```

`disable` sospende **tutto** il plugin: insieme ai blocchi di `guard-commands`, `guard-secrets`, `guard-patterns` e `limit-one-question` si fermano anche gli avvisi e i promemoria. Non esiste un modo di sospendere un solo hook senza modificare il plugin.

## Migrazione dagli hook copiati a mano

Se i primi quattro hook (`rules-watch` è nato nel plugin e non ha copie manuali) erano stati copiati in `~/.claude/` e registrati in `~/.claude/settings.json`, vanno **tolti prima di installare il plugin**, altrimenti ogni hook gira due volte (e `session-plan` non segnala le regole cambiate):

1. rimuovere da `~/.claude/settings.json` le voci `hooks` dei quattro script;
2. installare il plugin (sopra);
3. eliminare dalla cartella `~/.claude/` le copie dei quattro script (`ask-one-question.mjs`, `limit-one-question.mjs`, `guard-commands.mjs`, `session-plan.mjs`).

`session-rules-state.json` si conserva: il plugin continua a usarlo.

## Cosa resta fuori dal plugin

Restano fuori dai hook anche il lint automatico dopo ogni modifica e `docker compose config`: i controlli del plugin sono testuali e non eseguono strumenti esterni.

## Versionamento

SemVer. La versione sale solo al rilascio, insieme a una sottosezione di rilascio in `CHANGELOG.md`, sotto il titolo del giorno.
