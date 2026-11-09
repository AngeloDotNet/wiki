---
sidebar_position: 3
sidebar_label: Plugin kit
---

# Plugin `kit`

Il repository è anche un **marketplace** di Claude Code (`claude-config`) che contiene il plugin `kit`: tredici controlli personali, distribuiti in sei script, che fanno rispettare in modo tecnico alcune regole del template e tengono Claude allineato alle regole aggiornate. Il plugin si installa una volta per macchina e vale per tutti i progetti; alcuni controlli valgono solo nei progetti che hanno `.claude/rules/core.md` (vedi [Attivazione](#attivazione)). Le regole (`.claude/rules/`) non fanno parte del plugin e si copiano nei progetti come descritto in [Come si usa](uso.md). Dalla versione 1.9.0 il plugin aggiunge anche diciannove comandi `/kit:...` (sezione [Comandi](#comandi)).

## Cosa contiene

I tredici controlli si dividono in tre famiglie:

- **blocchi**: fermano l'operazione; Claude riceve il motivo e deve correggere;
- **avvisi**: l'operazione passa; Claude e l'utente ricevono un avviso da correggere nel passo successivo;
- **promemoria**: ricordano una regola a inizio o fine sessione, senza bloccare.

Gli script sono sei. Quattro raggruppano più controlli dello stesso evento; `guard-commands` e `limit-one-question` ne fanno uno ciascuno:

- `guard-write` esegue `guard-secrets` e `guard-patterns` prima di una scrittura;
- `check-write` esegue `check-plan`, `check-quality` e `check-practice` dopo una scrittura;
- `session-close` esegue `plan-reminder`, `check-close` e `site-reminder` a fine di ogni risposta;
- `prompt-start` esegue `ask-one-question`, `rules-watch` e `site-question` a ogni messaggio.

Le tabelle seguenti usano i nomi dei controlli. Gli avvisi di `check-write` (qualità e pratica) dello stesso file escono in un unico messaggio; lo stesso vale per i promemoria di `session-close`.

### Blocchi

| Hook | Evento | Cosa fa |
|---|---|---|
| `limit-one-question` | `PreToolUse` su `AskUserQuestion` | Blocca le chiamate con più di una domanda. |
| `guard-commands` | `PreToolUse` su `Bash` e `PowerShell` | Blocca sempre `git init`, `git push --force` e varianti, la cancellazione di branch remoti, `reset --hard`, `clean -f`, `--no-verify`, `rm -rf`. Blocca anche `gh pr create/merge` e `gh release` finché il `CLAUDE.md` del progetto non dichiara la GitHub CLI installata (vedi [Integrazione GitHub](#integrazione-github)). Blocca i commit su `main`/`develop` (con l'istruzione di proporre un branch da `develop`), `git add -A`, `git add --all` e `git add .`, l'aggiunta di file sensibili (`.env` non `.env.example`, `secrets.json`, `*.pfx`, `*.p12`, `*.key`, `*.pem`, `*.jks`) e i commit con messaggio non conforme a Conventional Commits (oggetto di al massimo 72 caratteri, descrizione minuscola, senza punto finale). Push, tag e `gh workflow run` non sono bloccati. |
| `guard-secrets` | `PreToolUse` su `Write`, `Edit`, `MultiEdit` | Blocca la scrittura di segreti reali: valori in chiavi come `Password`, `Secret`, `Token`, `Key` o password in una stringa di connessione dentro `appsettings*.json`; password in chiaro in `docker-compose*.yml` e `Dockerfile`; chiavi private PEM, chiavi AWS e token JWT completi. Un segnaposto (`CHANGE-ME…`, `${VAR}`, `placeholder…`) passa solo se il valore intero ha quella forma: una parola come `example` dentro un valore non basta. I token JWT non si controllano nei file `.md`, dove la documentazione li usa come esempio. |
| `guard-patterns` | `PreToolUse` su `Write`, `Edit`, `MultiEdit` | Blocca undici pattern vietati dalle regole: test saltati (`skip`, `Ignore`, `.only`), attese arbitrarie nei test (`Task.Delay`, `Thread.Sleep`), Angular legacy (NgModule, `*ngIf`, `*ngFor`), librerie vietate (MediatR, AutoMapper, Jest, Karma, Jasmine), EF Core InMemory, API insicure (`AllowAnyOrigin`, `BinaryFormatter`, MD5/SHA1, `eval`), SQL interpolato (`FromSqlRaw($"...")`), `npm install` o `npm ci` senza `--ignore-scripts` nel Dockerfile, TLS disattivato in `appsettings*.json`, `NoWarn` di progetto nei `.csproj` e `.props`, `catch` con blocco vuoto. Ammette le deroghe [`kit-allow`](#deroghe-kit-allow). |

### Avvisi

| Hook | Evento | Cosa fa |
|---|---|---|
| `check-plan` | `PostToolUse` su `Write`, `Edit`, `MultiEdit` (solo per `PIANO.md`) | Segnala un passo spuntato `[x]` che non riporta l'esito di build e di test (`core.md` §6.21). È l'unico avviso che blocca: esce con 2 e il motivo su stderr. |
| `check-quality` | `PostToolUse` su `Write`, `Edit`, `MultiEdit` | Avvisa su Docker (immagini senza tag o con `latest`, porte host di database e broker esposte), su dipendenze (range di versione `*` e `latest` in `package.json`; `^` e `~` non si segnalano più; promemoria di `npm audit` o `dotnet list package --vulnerable` quando cambiano i pacchetti) e sul frontend (`any`, `innerHTML`, `bypassSecurityTrust*`, colori esadecimali hardcoded: nei `.ts` solo tra virgolette, nei `.html` solo dentro `style`). |
| `check-practice` | `PostToolUse` su `Write`, `Edit`, `MultiEdit` | Avvisa su scritture in blocco (`ExecuteUpdate`, `ExecuteDelete`), soppressioni di analyzer senza motivo, endpoint `AllowAnonymous`, `Regex` senza `matchTimeout`, `console.log` e `Console.Write` nel codice, membri pubblici C# senza commento `///`, file nuovo di servizio (`*Service`, `*Handler`, `*Validator`, `.service.ts`, `.component.ts`, `.pipe.ts`) senza test. Ammette le deroghe `kit-allow`. |

### Promemoria

| Hook | Evento | Cosa fa |
|---|---|---|
| `ask-one-question` | `UserPromptSubmit` | A ogni messaggio ricorda la regola "nel dubbio, una domanda alla volta" (`core.md`, sezione in testa). |
| `rules-watch` | `UserPromptSubmit` | A ogni messaggio controlla se le regole del progetto sono cambiate durante la sessione (per esempio dopo un `git pull`) e, se sì, ordina di rileggere i file cambiati allegando il `git diff`. Una volta per sessione confronta anche le regole con quelle del template. |
| `plan-reminder` | `Stop` | A fine di ogni risposta, se `PIANO.md` ha ancora passi con casella `[ ]` o `[~]`, lo segnala all'utente. |
| `check-close` | `Stop` | A fine di ogni risposta, sulle modifiche non ancora committate, ricorda: codice modificato senza `CHANGELOG.md` aggiornato, modello EF cambiato senza una nuova migrazione, chiavi `it.json` ed `en.json` diverse. Usa `git status`. |
| `site-question` | `UserPromptSubmit` | A ogni messaggio, finché la voce `sito` di `~/.claude/kit-progetti.json` manca o dice `esiste: false` senza `chiesto`, chiede a Claude di domandarti se il progetto ha una wiki o un sito di documentazione dedicato (sì/no; se sì, il percorso assoluto). Un «no» salva `chiesto: true` e la domanda non torna. Solo nei progetti con `core.md`. |
| `site-reminder` | `Stop` | Se la voce `sito` ha `esiste: true`, `CHANGELOG.md` o `README.md` del progetto sono modificati e la cartella del sito non ha modifiche non committate, ricorda di aggiornare il sito (`core.md` §5b). Non dice nulla se la cartella del sito non è un repository git. Solo nei progetti con `core.md`. |

Il blocco dei comandi vietati è assoluto: chi vuole un'eccezione esegue il comando a mano (prefisso `!` nel prompt) oppure disattiva il plugin. Push e tag sono sempre consentiti; PR e rilasci passano con `gh` se la GitHub CLI è dichiarata installata (vedi sotto).

`rules-watch` salva le impronte delle regole (`CLAUDE.md` e `.claude/rules/*.md`) in `~/.claude/session-rules-state.json` (una voce per cartella di progetto, più l'hash di `HEAD` e un marcatore di sessione). Gli script richiedono Node.js; il diff richiede anche `git`. Un hook non può obbligare Claude a rileggere i file: inserisce nel contesto l'ordine di farlo.

## Comandi

Il plugin aggiunge diciannove comandi, che si lanciano digitando `/kit:` seguito dal nome. Non partono mai da soli: sono impostati perché solo l'utente li possa lanciare, e scrivono file solo quando li lanci tu. Nessun comando ha opzioni con nome (`--flag`): la colonna «Argomento» indica l'unico argomento facoltativo, dove c'è.

| Comando | Cosa fa | Scrive file | Argomento |
|---|---|---|---|
| `/kit:buongiorno` | All'inizio della giornata rilegge `PIANO.md` e `CHECKLIST.md`, riassume dove si è arrivati, cosa fare e le priorità, e propone il primo passo. Attende il tuo ok. | No | Nessuno |
| `/kit:buonasera` | A fine giornata salva in `PIANO.md` lo stato dei lavori (passi completati, prossimo passo, decisioni aperte, file toccati, test rotti) e aggiunge i nuovi problemi in `CHECKLIST.md`. Stampa il prompt per la sessione successiva. Non salva la conversazione. | Sì (`PIANO.md`, `CHECKLIST.md`) | Nessuno |
| `/kit:avvia-progetto` | Avvia un progetto nuovo: fa le domande di avvio una per messaggio e compila il `CLAUDE.md`. | Sì (`CLAUDE.md`) | `[nome-progetto]`: nome del progetto |
| `/kit:copia-regole` | Copia le regole del template in un progetto che non le ha, con i moduli scelti in conversazione. | Sì (regole e file di root) | `[cartella-progetto]`: cartella di destinazione; se manca la chiede |
| `/kit:aggiorna-regole` | Confronta le regole di un progetto con il template e propone gli aggiornamenti. Ogni file diverso si sovrascrive solo con la tua conferma, e il vecchio resta come `.bak`. | Sì, solo con conferma | `[cartella-progetto]`: progetto da aggiornare; se manca la chiede |
| `/kit:consegna` | Passa la checklist di consegna (`core.md` §0b) sul lavoro corrente e segnala le voci mancanti. | No | Nessuno |
| `/kit:review-regole` | Revisione del codice contro le regole di `.claude/rules/` e il `CLAUDE.md` del progetto, in sola lettura. Integra il controllo integrato di Claude Code, non lo sostituisce. | No | `[percorso-o-branch]`: percorso o branch da rivedere; se manca usa il lavoro corrente |
| `/kit:commit-passo` | Crea i commit locali uno alla volta, mai su `main` o `develop` (propone il branch di lavoro da `develop`, o `hotfix/` da `main`). Piano in `piano-commit.md`; chiede il tipo di commit solo se ambiguo e l'ok prima di ogni commit. Con un numero (`/kit:commit-passo 5`) esegue fino a N commit di fila senza ok a ciascuno, entro il tetto per lotto del `CLAUDE.md` (voce «Commit di fila, massimo per lotto», chiesta una volta solo quando si passa il numero). Non fa push. Non richiede la GitHub CLI. | Sì (commit, `piano-commit.md`) | `[N]`: numero di commit da eseguire di fila senza ok a ciascuno, entro il tetto per lotto del `CLAUDE.md` |
| `/kit:pr-develop` | Apre con `gh` la PR dal branch di lavoro (`feature/*`, `bugfix/*`) verso `develop`, con titolo Conventional Commits; push e creazione solo dopo conferma. Richiede la GitHub CLI installata e autenticata. Il merge (squash) resta a te. | Sì (push, PR) | Nessuno |
| `/kit:pr-main` | Apre con `gh` la PR da `develop` (o `release/*`, `hotfix/*`) verso il branch principale, dopo aver controllato che `main` non abbia commit assenti da `develop`; push e creazione solo dopo conferma. Richiede la GitHub CLI installata e autenticata. Il merge (merge commit) resta a te. | Sì (push, PR) | `[branch-sorgente]`: branch di partenza; se manca, il branch corrente se è `release/*` o `hotfix/*`, altrimenti `develop` |
| `/kit:aggiorna-docs` | Aggiorna `README.md` e `CHANGELOG.md` del progetto, crea il `README.md` se manca, e, se esiste, il sito di documentazione esterno. Scrive la voce di rilascio nel `CHANGELOG.md` solo su richiesta. | Sì | `[cartella-progetto]`: progetto da aggiornare |
| `/kit:verifica` | Esegue i controlli di una soluzione .NET (ripristino, build in Release, test, pacchetti vulnerabili, modello EF senza migrazione, spazi bianchi) e riporta l'esito reale, senza correggere nulla. | No (solo cartelle di build) | `[cartella-soluzione]`: cartella con il `.sln`; se manca cerca nella radice del repository |
| `/kit:qualita-test` | Revisiona i test cercando falsa sicurezza, fragilità e duplicati, e propone test xUnit parametrici e leggibili. | No | `[cartella-o-file]`: ambito dei test |
| `/kit:dati-efcore` | Guida il lavoro con Entity Framework Core: letture senza tracking, migrazioni, ciclo di vita del `DbContext`, ottimizzazione delle query. | No | `[cartella-o-progetto]`: progetto da esaminare |
| `/kit:accessi-api` | Guida autenticazione e autorizzazione di un'API ASP.NET Core: schemi, policy, handler, scope e claim. | No | `[cartella-o-progetto]`: progetto da esaminare |
| `/kit:gdpr-dati` | Revisiona il backend rispetto ai principi GDPR (minimizzazione, conservazione, log, diritti degli interessati). Non è consulenza legale. | No | `[cartella-o-progetto]`: progetto da esaminare |
| `/kit:accessibilita-ui` | Revisiona l'accessibilità dell'interfaccia rispetto a WCAG 2.2, con una gravità per ogni problema. Le correzioni si chiedono con una richiesta separata. | No | `[cartella-o-componente]`: parte dell'interfaccia da esaminare |
| `/kit:colori-tema` | Costruisce o verifica la palette per i temi chiaro e scuro, con il contrasto misurato sui valori resi. | No | `[cartella-progetto]`: progetto da esaminare |
| `/kit:localizzazione` | Verifica il layout per testi tradotti più lunghi, orientamento RTL, ordine di lettura e zoom. | No | `[cartella-progetto]`: progetto da esaminare |

Due note pratiche:

- La scelta di gestire o no le priorità si chiede una volta per progetto. Il percorso della wiki si chiede a ogni messaggio finché non rispondi (sì/no; se sì, il percorso assoluto). Le risposte si salvano in `~/.claude/kit-progetti.json`, sulla tua macchina e fuori dai repository. Il file non va copiato così com'è su un altro computer: i percorsi cambiano.
- Lo script Windows `copia-regole.bat` non c'è più: `/kit:copia-regole` e `/kit:aggiorna-regole` ne fanno il lavoro, passando da Claude, che chiede una domanda alla volta.

### Il file `~/.claude/kit-progetti.json`

È sulla tua macchina e fuori dai repository. Contiene una voce per progetto: la chiave è il percorso assoluto della radice del repository, con `/` al posto di `\`. Ogni voce può avere due chiavi:

- `sito`: `{ "esiste": true, "percorso": "..." }` se il progetto ha una wiki o un sito di documentazione dedicato (percorso assoluto); `{ "esiste": false, "chiesto": true }` se hai risposto di no; `{ "esiste": false }` o la voce mancante finché non rispondi. La scrive Claude dopo la tua risposta alla domanda di `site-question`, oppure `/kit:aggiorna-docs`; la legge `site-question` a ogni messaggio e `site-reminder` a fine risposta.
- `priorita`: `true` o `false`. La scrive `/kit:buonasera` la prima volta che lo lanci nel progetto; la legge `/kit:buongiorno`, che ordina i passi aperti per etichetta `[P1]`, `[P2]`, `[P3]`, e la stessa `/kit:buonasera`, che scrive le etichette sui passi. Se la chiave manca, `/kit:buongiorno` tratta le priorità come `false`.

```json
{
  "E:/Disco_E/Progetti/esempio-con-sito": {
    "sito": { "esiste": true, "percorso": "E:/Disco_E/Progetti/wiki" },
    "priorita": false
  },
  "E:/Disco_E/Progetti/esempio-senza-sito": {
    "sito": { "esiste": false, "chiesto": true }
  }
}
```

Le skill creano il file se manca e aggiornano solo la chiave che gestiscono, lasciando intatte le altre voci. Modificarlo a mano è sicuro se il JSON resta valido. Non va copiato su un altro computer, perché i percorsi cambiano.

## Attivazione

- **In ogni progetto:** `guard-commands`, `guard-secrets`, `check-quality`, `check-plan`, `plan-reminder`, `rules-watch`, `ask-one-question`, `limit-one-question`.
- **Solo nei progetti con `.claude/rules/core.md`:** `guard-patterns`, `check-practice`, `check-close`, `site-question`, `site-reminder`. Il file è il segno che il progetto usa le regole del template; senza di esso questi cinque controlli non fanno nulla.

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

Push e tag sono **sempre consentiti**: il hook non li blocca, e Claude li esegue su richiesta o con conferma. PR e rilasci usano la GitHub CLI (`gh`): passano solo se il `CLAUDE.md` del progetto dichiara la CLI installata, nella sezione «Eccezioni alle regole globali»:

```
- **GitHub CLI (gh) installata:** sì (2026-11-08)
```

- La domanda si fa una sola volta per progetto, poi la risposta resta nel `CLAUDE.md`. Con `no`, o senza riga, `gh pr` e `gh release` restano bloccati.
- La data in fondo è facoltativa.
- La riga si legge dal `CLAUDE.md` della radice del repository, anche se il comando parte da una sottocartella. Fuori da un repository si legge quello della cartella del comando.
- Anche con la CLI installata restano sempre bloccati `git push --force` (e varianti), la cancellazione di branch remoti, `reset --hard`, `clean -f`, `--no-verify` e `git init`.
- `gh workflow run` non è bloccato dal hook. La regola (`git.md`) impone una domanda esplicita di conferma prima di ogni esecuzione.
- Le indicazioni a Claude su quando e come usare queste operazioni sono nella regola `git.md`, non nel hook.

## Limiti dei controlli

- I controlli leggono il testo che Claude scrive con `Write`, `Edit` e `MultiEdit`. Non vedono le modifiche fatte da Bash, per esempio con `sed` o con una redirezione.
- Con `Edit` il hook vede solo il testo nuovo: se una modifica tocca una riga che ha già una deroga, la deroga va ripetuta nella modifica.
- I controlli sul C# sono espressioni regolari, non un parser: membri su più righe o attributi complessi possono sfuggire o dare falsi positivi.
- Gli avvisi non fermano il lavoro; i blocchi sì. Una falsa positività su un blocco si risolve con una deroga, non disattivando il hook.

## Test degli hook

```
node --test "plugins/kit/tests/*.test.mjs"
```

I test usano cartelle temporanee e una home finta (non toccano `~/.claude`); i casi con git clonano questo repository, quindi vanno eseguiti al suo interno. I casi che clonano il repository (`rules-watch.test.mjs`) copiano le regole nel clone se non sono ancora committate, quindi passano anche prima del primo commit. I test di `rules-watch` tolgono dall'output il promemoria della regola inviolabile, che `prompt-start` aggiunge sempre. Registrano anche la risposta «no» sulla wiki (`chiesto: true`) nella home finta, così la domanda di `site-question` non compare nei test.

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

Con la versione 1.10.0 i dodici controlli sono raggruppati in sei script (vedi [Cosa contiene](#cosa-contiene)). Il nome dei controlli non cambia. Dopo l'aggiornamento non servono azioni nei progetti.

Il procedimento per chi mantiene il template è in [Manutenzione](manutenzione.md).

## Regole aggiornate: cosa controlla `rules-watch`

Il controllo `rules-watch` gira nello script `prompt-start`, insieme al promemoria della regola inviolabile.

- **Regole cambiate nella sessione.** Se un file di regole cambia (o viene aggiunto o rimosso) tra un messaggio e l'altro, Claude riceve l'elenco e l'ordine di rileggerlo. Il promemoria compare una volta sola per modifica; se nulla è cambiato, nessun testo in più.
- **Diff con git.** In un repository l'avviso include il `git diff` dei soli file cambiati, calcolato dall'hash di `HEAD` salvato (commit successivi e modifiche non committate). Il diff è troncato e, a inizio sessione, limitato in modo che l'output resti sotto i 10.000 caratteri. Senza git, o con un hash non valido, resta l'elenco dei file. I file nuovi non tracciati compaiono nell'elenco ma non nel diff.
- **Regole del template più recenti.** Una volta per sessione e per progetto, `rules-watch` confronta la versione di ogni modulo di regole con intestazione di versione (per ora `core.md` e `frontend.md`) tra il progetto e il template, solo per i moduli che il progetto ha. Se un modulo del template è più avanti, Claude riceve i moduli con le versioni e i file diversi e deve proporti l'allineamento con una sola domanda: non copia nulla senza il tuo ok. Una differenza di contenuto a parità di versione non viene segnalata (potrebbe essere una deroga voluta, da annotare in `CLAUDE.md`).
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

`disable` sospende **tutto** il plugin: insieme ai blocchi di `guard-commands`, `guard-write` (`guard-secrets` e `guard-patterns`) e `limit-one-question` si fermano anche gli avvisi e i promemoria. Non esiste un modo di sospendere un solo controllo senza modificare il plugin.

## Migrazione dagli hook copiati a mano

Se alcuni hook erano stati copiati in `~/.claude/` e registrati in `~/.claude/settings.json`, vanno **tolti prima di installare il plugin**, altrimenti ogni hook gira due volte. Gli script da cercare sono di due tipi:

- **Script attuali del plugin:** `guard-write.mjs`, `check-write.mjs`, `session-close.mjs`, `prompt-start.mjs`, `guard-commands.mjs`, `limit-one-question.mjs`. Quelli copiati vanno rimossi dalle voci `hooks` anche se il loro nome è lo stesso.
- **Script non più presenti nel plugin:** quelli della versione 1.9.0, sostituiti dalla 1.10.0 (`ask-one-question.mjs`, `rules-watch.mjs`, `guard-secrets.mjs`, `guard-patterns.mjs`, `check-plan.mjs`, `check-quality.mjs`, `check-practice.mjs`, `plan-reminder.mjs`, `check-close.mjs`), e `session-plan.mjs` della 1.10.0, eliminato perché il piano a inizio sessione è la regola di `core.md` §6.16. Se erano copiati, le loro voci vanno tolte allo stesso modo.

1. rimuovere da `~/.claude/settings.json` le voci `hooks` degli script copiati, dei due tipi sopra;
2. installare il plugin (sopra);
3. eliminare dalla cartella `~/.claude/` le copie di quegli script.

`session-rules-state.json` si conserva: il plugin continua a usarlo.

## Cosa resta fuori dal plugin

Restano fuori dai hook anche il lint automatico dopo ogni modifica e `docker compose config`: i controlli del plugin sono testuali e non eseguono strumenti esterni.

## Versionamento

SemVer. La versione sale solo al rilascio, insieme a una sottosezione di rilascio in `CHANGELOG.md`, sotto il titolo del giorno.
