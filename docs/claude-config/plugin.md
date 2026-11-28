---
sidebar_position: 3
sidebar_label: Plugin kit
---

# Plugin `kit`

Il repository è anche un **marketplace** di Claude Code (`claude-config`) che contiene il plugin `kit`: tredici controlli personali, distribuiti in sei script, che fanno rispettare in modo tecnico alcune regole del template e tengono Claude allineato alle regole aggiornate. Il plugin si installa una volta per macchina e vale per tutti i progetti; alcuni controlli valgono solo nei progetti che hanno `.claude/rules/core.md` (vedi [Attivazione](#attivazione)). Le regole (`.claude/rules/`) non fanno parte del plugin e si copiano nei progetti come descritto in [Come si usa](uso.md). Il plugin aggiunge anche i comandi `/kit:...` (oggi dodici; sezione [Comandi](#comandi)).

## Cosa contiene

I tredici controlli si dividono in tre famiglie:

- **blocchi**: fermano l'operazione; Claude riceve il motivo e deve correggere;
- **avvisi**: l'operazione passa; Claude e l'utente ricevono un avviso da correggere nel passo successivo;
- **promemoria**: ricordano una regola a inizio o fine sessione, senza bloccare.

Gli script sono sei. Quattro raggruppano più controlli dello stesso evento; `guard-commands` e `limit-one-question` ne fanno uno ciascuno:

- `guard-write` esegue `guard-secrets` e `guard-patterns` prima di una scrittura;
- `check-write` esegue `check-quality` e `check-practice` dopo una scrittura;
- `session-close` esegue `check-close` e `site-reminder` a fine di ogni risposta; contiene anche l'avviso sul cambio di modello (vedi [Log dei modelli](#log-dei-modelli-usati-nella-sessione));
- `prompt-start` esegue `ask-one-question`, `rules-watch` e `site-question` a ogni messaggio; contiene anche il promemoria sulla versione del plugin (vedi [Versione del plugin](#versione-del-plugin-promemoria-di-aggiornamento)).

Le tabelle seguenti usano i nomi dei controlli. Gli avvisi di `check-write` (qualità e pratica) dello stesso file escono in un unico messaggio; lo stesso vale per i promemoria di `session-close`.

### Blocchi

| Hook | Evento | Cosa fa |
|---|---|---|
| `limit-one-question` | `PreToolUse` su `AskUserQuestion` | Blocca le chiamate con più di una domanda. |
| `guard-commands` | `PreToolUse` su `Bash` e `PowerShell` | Blocca sempre `git push --force` e varianti, la cancellazione di branch remoti (consentita solo per `feature/`, `bugfix/`, `release/`, `hotfix/`), `reset --hard`, `clean -f`, `--no-verify`, `rm -rf`. Blocca anche `gh pr create/merge` e `gh release` finché il `CLAUDE.md` del progetto non dichiara la GitHub CLI installata (vedi [Integrazione GitHub](#integrazione-github)). Blocca i commit su `main`/`develop` (con l'istruzione di creare il branch di lavoro senza chiedere conferma), `git add -A`, `git add --all` e `git add .`, l'aggiunta di file sensibili (`.env` non `.env.example`, `secrets.json`, `*.pfx`, `*.p12`, `*.key`, `*.pem`, `*.jks`) e i commit con messaggio non conforme a Conventional Commits (`tipo(scope): descrizione`; maiuscola iniziale, punto finale e lunghezza sono regole scritte, non più controllate dal hook). `git init` non è più bloccato dal hook ma resta vietato a Claude dalle regole. Push, tag e `gh workflow run` non sono bloccati. |
| `guard-secrets` | `PreToolUse` su `Write`, `Edit`, `MultiEdit` | Blocca la scrittura di segreti reali: valori in chiavi come `Password`, `Secret`, `Token`, `Key` o password in una stringa di connessione dentro `appsettings*.json`; password in chiaro in `docker-compose*.yml` e `Dockerfile`; chiavi private PEM, chiavi AWS e token JWT completi. Un segnaposto (`CHANGE-ME…`, `${VAR}`, `placeholder…`) passa solo se il valore intero ha quella forma: una parola come `example` dentro un valore non basta. I token JWT non si controllano nei file `.md`, dove la documentazione li usa come esempio. |
| `guard-patterns` | `PreToolUse` su `Write`, `Edit`, `MultiEdit` | Blocca undici pattern vietati dalle regole: test saltati (`skip`, `Ignore`, `.only`), attese arbitrarie nei test (`Task.Delay`, `Thread.Sleep`), Angular legacy (NgModule, `*ngIf`, `*ngFor`), librerie vietate (MediatR, AutoMapper, Jest, Karma, Jasmine), EF Core InMemory, API insicure (`AllowAnyOrigin`, `BinaryFormatter`, MD5/SHA1, `eval`), SQL interpolato (`FromSqlRaw($"...")`), `npm install` o `npm ci` senza `--ignore-scripts` nel Dockerfile, TLS disattivato in `appsettings*.json`, `NoWarn` di progetto nei `.csproj` e `.props`, `catch` con blocco vuoto. Ammette le deroghe [`kit-allow`](#deroghe-kit-allow). |

### Avvisi

| Hook | Evento | Cosa fa |
|---|---|---|
| `check-quality` | `PostToolUse` su `Write`, `Edit`, `MultiEdit` | Avvisa su Docker (immagini senza tag o con `latest`, porte host di database e broker esposte), su dipendenze (range di versione `*` e `latest` in `package.json`; `^` e `~` non si segnalano più; promemoria di `npm audit` o `dotnet list package --vulnerable` quando cambiano i pacchetti) e sul frontend (`any`, `innerHTML`, `bypassSecurityTrust*`, colori esadecimali hardcoded: nei `.ts` solo tra virgolette, nei `.html` solo dentro `style`; decoratori `@Input`/`@Output`/`@ViewChild`/`@ContentChild`, `@HostBinding`/`@HostListener`, `template:` e `styles:` inline, `mutate()` su un signal, `waitForTimeout`, `ngClass`/`ngStyle`, `transition: all`). Sono avvisi non bloccanti. |
| `check-practice` | `PostToolUse` su `Write`, `Edit`, `MultiEdit` | Avvisa su scritture in blocco (`ExecuteUpdate`, `ExecuteDelete`), soppressioni di analyzer senza motivo, endpoint `AllowAnonymous`, `Regex` senza `matchTimeout`, `console.log` e `Console.Write` nel codice, membri pubblici C# senza commento `///`, file nuovo di servizio (`*Service`, `*Handler`, `*Validator`, `.service.ts`, `.component.ts`, `.pipe.ts`) senza test. Ammette le deroghe `kit-allow`. |

### Promemoria

| Hook | Evento | Cosa fa |
|---|---|---|
| `ask-one-question` | `UserPromptSubmit` | A ogni messaggio ricorda la regola "nel dubbio, una domanda alla volta" (`core.md`, sezione in testa). Solo nei progetti con il kit e con un profilo diverso da `mini` (senza un profilo leggibile vale `strutturato`) aggiunge il richiamo a piano e issue per il lavoro non piccolo. |
| `rules-watch` | `UserPromptSubmit` | A ogni messaggio controlla se le regole del progetto sono cambiate durante la sessione (per esempio dopo un `git pull`) e, se sì, ordina di rileggere i file cambiati allegando il `git diff`. Una volta per sessione confronta anche le regole con quelle del template. |
| `check-close` | `Stop` | A fine di ogni risposta, sulle modifiche non ancora committate, ricorda: codice modificato senza `CHANGELOG.md` aggiornato, modello EF cambiato senza una nuova migrazione, chiavi `it.json` ed `en.json` diverse. Usa `git status`. |
| `site-question` | `UserPromptSubmit` | A ogni messaggio, finché la voce `sito` di `~/.claude/kit-progetti.json` manca o dice `esiste: false` senza `chiesto`, chiede a Claude di domandarti se il progetto ha una wiki o un sito di documentazione dedicato (sì/no; se sì, il percorso assoluto). Un «no» salva `chiesto: true` e la domanda non torna. Solo nei progetti con `core.md`. |
| `site-reminder` | `Stop` | Se la voce `sito` ha `esiste: true`, `CHANGELOG.md` o `README.md` del progetto sono modificati e la cartella del sito non ha modifiche non committate, ricorda di aggiornare il sito (`core.md` §5b). Non dice nulla se la cartella del sito non è un repository git. Solo nei progetti con `core.md`. |
| `session-start` | `SessionStart` | Solo nei progetti attivati con `"sincronizzazione": true` nella loro voce di `~/.claude/kit-progetti.json` (spenta per default): all'avvio o alla ripresa allinea le regole del progetto al tag più recente del template (`_template/moduli.json`, file `.claude/rules/`), crea il backup e lascia una domanda alla volta per i conflitti. Non tocca i progetti non attivati. |

Il blocco dei comandi vietati è assoluto: chi vuole un'eccezione esegue il comando a mano (prefisso `!` nel prompt) oppure disattiva il plugin. Il push non è bloccato dal hook, ma si fa solo con il tuo via; la creazione di un tag solo con nome `X.Y.Z` (senza `v`) e dal branch `main`; PR e rilasci passano con `gh` se la GitHub CLI è dichiarata installata (vedi sotto).

`rules-watch` salva le impronte delle regole (`CLAUDE.md` e `.claude/rules/*.md`) in `~/.claude/session-rules-state.json` (una voce per cartella di progetto, più l'hash di `HEAD` e un marcatore di sessione). Gli script richiedono Node.js; il diff richiede anche `git`. Un hook non può obbligare Claude a rileggere i file: inserisce nel contesto l'ordine di farlo.

## Comandi

Il plugin aggiunge undici comandi, che si lanciano digitando `/kit:` seguito dal nome. Non partono mai da soli, tranne `/kit:pr-develop`, che Claude può lanciare dopo il tuo sì al termine di `/kit:commit-passo`: gli altri sono impostati perché solo l'utente li possa lanciare. I comandi di revisione, verifica, buongiorno e modelli non possono modificare file (gli strumenti `Edit`, `Write` e `NotebookEdit` sono disattivati mentre sono attivi); gli altri scrivono file o git solo quando li lanci tu. Nessun comando ha opzioni con nome (`--flag`): la colonna «Argomento» indica l'unico argomento facoltativo, dove c'è.

| Comando | Cosa fa | Scrive | Argomento |
|---|---|---|---|
| `/kit:buongiorno` | Riprende il lavoro: legge dalle issue del progetto (issue padre e sue sub-issue, con `gh`; anche una padre ancora aperta con le sub-issue tutte chiuse) il piano e i problemi, riassume dove si è arrivati e propone il primo passo. Non modifica nulla. | No | Nessuno |
| `/kit:buonasera` | A fine giornata registra lo stato nelle issue: chiude le sub-issue verificate, lascia la ripartenza sulla issue padre e apre le issue dei problemi nuovi. Aggiorna senza domande `README.md`, `CHANGELOG.md` e la wiki del progetto, se presente. Cerca i file non più utili (cancella solo quelli che confermi) e ricorda `/clear` o `/compact`. Non salva la conversazione. | Sì (file di documentazione, issue) | Nessuno |
| `/kit:avvia-progetto` | Avvia un progetto nuovo in un solo percorso: domande di avvio, una per messaggio, copia delle regole e compilazione del `CLAUDE.md`. `backend-email.md` e `backend-infra.md` non si chiedono all'avvio. La conferma del riepilogo vale per tutto l'avvio, senza un ok a ogni punto. Con il profilo `mini` il piano resta in chat (non servono issue né repository remoto); negli altri casi è una issue padre con le sub-issue. Si lancia in una cartella vuota o appena creata. | Sì (regole, `CLAUDE.md`, issue) | `[nome-progetto]`: nome del progetto |
| `/kit:regole` | Gestisce le regole di un progetto. Se non le ha, le copia dal template con i moduli scelti in conversazione e il profilo (caso A); con la modalità solo Git copia `core.md`, `lavoro.md`, `git-flusso.md` e `workflow.md`. Scrive il profilo scelto nel campo «Profilo» del `CLAUDE.md`. Se le ha già, le confronta con il template e sovrascrive i file diversi solo con la tua conferma, elimina quelli rimossi dal template e allinea le righe del `CLAUDE.md` legate alle regole (caso B). `security.md` si copia in ogni profilo (tranne in modalità solo Git): la domanda facoltativa riguarda le regole di sicurezza estese. Copie, confronti, aggiornamenti, spostamenti e cancellazioni li fa lo script `regole.mjs` del plugin, che salva un `.bak` prima di sostituire o cancellare; nella prima copia il `CLAUDE.md` mancante si copia senza chiedere e dopo l'anteprima la copia parte senza altre conferme. | Sì (regole e file di root) | `[cartella-progetto]`: cartella di destinazione o progetto da aggiornare; se manca usa la cartella corrente quando è valida, altrimenti la chiede |
| `/kit:commit-passo` | Crea i commit locali del lavoro in corso, come da `git-flusso.md`, in sequenza e senza conferme intermedie. Mai su `main` o `develop`: crea il branch di lavoro da solo. Se il lavoro ha già una issue padre, a fine serie la commenta con hash e oggetto dei commit; altrimenti apre una issue padre con le sub-issue solo fuori dal profilo `mini`, con almeno tre commit e con la GitHub CLI disponibile; negli altri casi il piano resta in chat. Si ferma con una domanda solo nei casi anomali. A fine lavoro propone la PR con `/kit:pr-develop` e la esegue solo dopo il tuo sì. Non fa push. | Sì (commit, issue) | Nessuno |
| `/kit:pr-develop` | Apre con `gh` la PR dal branch di lavoro (`feature/*`, `bugfix/*`) verso `develop`, con titolo Conventional Commits (diventa il commit di squash); push e creazione senza altra conferma, perché il lancio è il via libera. Non fa il merge. Richiede la GitHub CLI installata e autenticata. | Sì (push, PR) | Nessuno |
| `/kit:pr-main` | Apre con `gh` la PR da `develop` (o da `release/*`, `hotfix/*`) verso il branch principale, con merge commit e senza conferma intermedia. Dopo il merge si lancia `/kit:pr-main pulizia`: non apre PR, controlla con `gh` che la PR sia `MERGED` (altrimenti si ferma senza cancellare nulla), pulisce i branch di lavoro e allinea `main` e `develop` con `git pull --ff-only`. Richiede la GitHub CLI installata e autenticata. | Sì (push, PR, branch) | `[branch-sorgente]` oppure `pulizia`; senza branch usa quello corrente se è `release/*` o `hotfix/*`, altrimenti `develop` |
| `/kit:rilascio` | Prepara e, passo per passo, esegue il rilascio come da `git-flusso.md` («Rilascio»): `bump X.Y.Z` (commit di bump su `release/X.Y.Z`, con la voce del `CHANGELOG.md`), `tag` (tag annotato `X.Y.Z` sul merge commit su `main`, dopo la PR) e `gh` (release GitHub con le note della voce di rilascio). Ogni passo che scrive o pubblica chiede un sì prima di agire: il lancio non vale come via al tag né alla release. Non fa merge di PR né cancella branch. Il passo `gh` richiede la GitHub CLI installata e autenticata. | Sì (commit, tag, release: ciascuno con il tuo sì) | `bump X.Y.Z`, `tag` o `gh` (obbligatorio) |
| `/kit:verifica` | Controlla il lavoro corrente contro la checklist di consegna del profilo (`qualita.md` §0b; con `mini`, `checklist-mini.md`), senza eseguire nulla, poi esegue il controllo di una soluzione .NET (ripristino, formattazione, build in Release senza avvisi, `using` inutilizzati, test, pacchetti vulnerabili, modifiche al modello EF senza migrazione, compose valido, spazi bianchi), di un frontend Angular (procedura di `frontend.md`) o di entrambi, con un esito unico, e riporta l'esito reale senza modificare file. | No (solo cartelle di build) | `[cartella]`: controlla solo quella; se manca, i file toccati dal lavoro (anche nei commit del branch) decidono quali parti controllare |
| `/kit:revisione` | Revisione in sola lettura di un tema: `accessi-api`, `dati-efcore`, `gdpr-dati`, `accessibilita-ui`, `colori-tema`, `localizzazione`, `qualita-test`, `review-regole`, `sicurezza`. Propone, non modifica file. Il tema è obbligatorio. | No | `<tema>` e, facoltativo, `[cartella-o-percorso]`; se il tema manca lo chiede |
| `/kit:modelli` | Mostra quali modelli sono stati usati nella sessione corrente e per cosa (sessione, skill, subagent), leggendo il registro della sessione e non il contesto del modello. | No | Nessuno |

Il comando `/kit:revisione` sostituisce undici comandi della versione 1.x: `/kit:sicurezza`, `/kit:gdpr-dati`, `/kit:accessi-api`, `/kit:dati-efcore`, `/kit:accessibilita-ui`, `/kit:colori-tema`, `/kit:localizzazione`, `/kit:qualita-test` e `/kit:review-regole` diventano `/kit:revisione <tema>`; `/kit:verifica-frontend` è assorbito da `/kit:verifica`; `/kit:aggiorna-docs` è assorbito da `/kit:buonasera`.

Due note pratiche:

- La scelta di gestire o no le priorità si chiede una volta per progetto. Il percorso della wiki si chiede a ogni messaggio finché non rispondi (sì/no; se sì, il percorso assoluto). Le risposte si salvano in `~/.claude/kit-progetti.json`, sulla tua macchina e fuori dai repository. Il file non va copiato così com'è su un altro computer: i percorsi cambiano.
- Lo script Windows `copia-regole.bat` non c'è più: `/kit:regole` ne fa il lavoro, passando da Claude, che chiede una domanda alla volta.

### Il file `~/.claude/kit-progetti.json`

È sulla tua macchina e fuori dai repository. Contiene una voce per progetto: la chiave è il percorso assoluto della radice del repository, con `/` al posto di `\`. Ogni voce può avere due chiavi:

- `sito`: `{ "esiste": true, "percorso": "..." }` se il progetto ha una wiki o un sito di documentazione dedicato (percorso assoluto); `{ "esiste": false, "chiesto": true }` se hai risposto di no; `{ "esiste": false }` o la voce mancante finché non rispondi. La scrive Claude dopo la tua risposta alla domanda di `site-question`, oppure `/kit:buonasera`; la legge `site-question` a ogni messaggio e `site-reminder` a fine risposta.
- `priorita`: `true` o `false`. La scrive `/kit:buonasera` la prima volta che lo lanci nel progetto; la legge `/kit:buongiorno`, che ordina i passi aperti per etichetta `[P1]`, `[P2]`, `[P3]`, e la stessa `/kit:buonasera`, che scrive le etichette sui passi. Se la chiave manca, `/kit:buongiorno` tratta le priorità come `false`.

```json
{
  "/percorso/del/progetto-con-sito": {
    "sito": { "esiste": true, "percorso": "/percorso/della/wiki" },
    "priorita": false
  },
  "/percorso/del/progetto-senza-sito": {
    "sito": { "esiste": false, "chiesto": true }
  }
}
```

Le skill creano il file se manca e aggiornano solo la chiave che gestiscono, lasciando intatte le altre voci. Modificarlo a mano è sicuro se il JSON resta valido. Non va copiato su un altro computer, perché i percorsi cambiano.

## Attivazione

- **In ogni progetto:** `guard-commands`, `limit-one-question` (`AskUserQuestion`), `guard-secrets`, `check-quality`, `ask-one-question`, `rules-watch`, `plugin-version`, `site-question`, `model-log`.
- **Solo nei progetti con `.claude/rules/core.md`:** `guard-patterns`, `check-practice`, `check-close`. Il file è il segno che il progetto usa le regole del template; senza di esso questi tre controlli non fanno nulla.
- `site-reminder` ricorda l'aggiornamento del sito solo se la voce `sito` di `~/.claude/kit-progetti.json` dice `esiste: true` e il progetto ha modifiche a `CHANGELOG.md` o `README.md`.

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

Il push (normale) non è bloccato dal hook, ma si fa solo con il tuo via. Il tag si crea solo con nome `X.Y.Z` (senza `v`) e dal branch `main`, dopo il merge: il hook blocca gli altri casi (elenco e cancellazione dei tag passano). Per tag, push del tag e rilascio Claude propone l'operazione di sua iniziativa e chiede il via dell'utente: il via non è verificabile dal hook, è una regola scritta. PR e rilasci usano la GitHub CLI (`gh`): passano solo se il `CLAUDE.md` del progetto dichiara la CLI installata, nella sezione «Eccezioni alle regole globali»:

```
- **GitHub CLI (gh) installata:** sì (2026-11-08)
```

- La domanda si fa una sola volta per progetto, poi la risposta resta nel `CLAUDE.md`. Con `no`, o senza riga, `gh pr` e `gh release` restano bloccati.
- La data in fondo è facoltativa.
- La riga si legge dal `CLAUDE.md` della radice del repository, anche se il comando parte da una sottocartella. Fuori da un repository si legge quello della cartella del comando.
- Anche con la CLI installata restano sempre bloccati `git push --force` (e varianti), la cancellazione di branch remoti diversi da `feature/`, `bugfix/`, `release/`, `hotfix/`, `reset --hard`, `clean -f` e `--no-verify`.
- `gh workflow run` non è bloccato dal hook. La regola (`git-flusso.md`, «Integrazione GitHub») impone una domanda esplicita di conferma prima di ogni esecuzione.
- Le indicazioni a Claude su quando e come usare queste operazioni sono nella regola `git-flusso.md`, non nel hook.

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

Con la versione 1.11.0 il plugin ha diciannove comandi (`claude plugin details kit@claude-config` li elenca nella riga «Skills») e tredici controlli. Il comando `/kit:code-review` è stato rinominato `/kit:review-regole`: chi lo usava deve adeguarsi. Arrivano `/kit:commit-passo`, `/kit:pr-develop` e `/kit:pr-main`, la domanda sulla wiki del progetto e il promemoria di aggiornamento del sito. Dopo l'aggiornamento, `/reload-plugins` o una nuova sessione; nei progetti conviene `/kit:aggiorna-regole` per portare `security.md` diviso in tre moduli e `git.md` 1.2.

Con la versione 1.12.0 il hook `guard-commands` blocca la creazione di un tag con nome diverso da `X.Y.Z` (senza `v`) o da un branch diverso da `main`. Cambia anche il formato dei tag: i rilasci precedenti usavano il prefisso `v` (per esempio `v1.11.0`), da qui in poi il tag è `1.12.0`. Dopo l'aggiornamento, `/reload-plugins` o una nuova sessione; nei progetti conviene `/kit:aggiorna-regole` per portare `git.md` 1.5 (formato e momento del tag, proposta del commit di bump).

Con la versione 1.13.0: il hook non blocca più `git init` né la forma dell'oggetto del commit; `attesa-test` e `nowarn` di `check-write` sono avvisi e non blocchi; le skill di commit e PR non chiedono più conferme intermedie (il lancio è il via libera); `/kit:pr-main` pulisce i branch dopo il merge; ogni skill dichiara `model` (`haiku` o `sonnet`) e le skill di sola lettura e `/kit:pr-develop` non hanno più `disable-model-invocation` (scelta rivista dopo la 1.13.0: vedi sotto).

Con la versione 1.14.0: il plugin ha ventuno comandi, con le nuove `/kit:verifica-frontend` e `/kit:sicurezza`; tutte le skill, tranne `/kit:pr-develop`, hanno `disable-model-invocation: true` e partono solo se le lanci tu (`/kit:pr-develop` la può lanciare Claude, solo dopo il tuo sì al termine di `/kit:commit-passo`); le tredici skill di revisione e controllo hanno anche `disallowed-tools: Edit Write NotebookEdit`, quindi non possono modificare file; ogni skill apre la risposta con la riga «Modello in uso: …», che serviva a vedere l'effetto del campo `model` (la riga è poi stata rimossa, non ancora rilasciato: il modello la leggeva dal contesto di inizio sessione e poteva dire un modello diverso da quello usato, mentre `model` funzionava; il modello realmente usato si legge nel registro della sessione, campo `message.model`); `/kit:consegna` ha il gruppo «non verificata» e un blocco «Da lanciare»; il hook `guard-commands` non scambia più le redirezioni (`2>&1`) per argomenti di git; `docker.md` diventa un modulo opzionale; `/kit:buonasera` consiglia `/clear` o `/compact` secondo il criterio di `lavoro.md`. Dopo l'aggiornamento, `/reload-plugins` o una nuova sessione; nei progetti conviene `/kit:aggiorna-regole`.

Il procedimento per chi mantiene il template è in [Manutenzione](manutenzione.md).

## Regole aggiornate: cosa controlla `rules-watch`

Il controllo `rules-watch` gira nello script `prompt-start`, insieme al promemoria della regola inviolabile.

- **Regole cambiate nella sessione.** Se un file di regole cambia (o viene aggiunto o rimosso) tra un messaggio e l'altro, Claude riceve l'elenco e l'ordine di rileggerlo. Il promemoria compare una volta sola per modifica; se nulla è cambiato, nessun testo in più.
- **Diff con git.** In un repository l'avviso include il `git diff` dei soli file cambiati, calcolato dall'hash di `HEAD` salvato (commit successivi e modifiche non committate). Il diff è troncato e, a inizio sessione, limitato in modo che l'output resti sotto i 10.000 caratteri. Senza git, o con un hash non valido, resta l'elenco dei file. I file nuovi non tracciati compaiono nell'elenco ma non nel diff.
- **Regole del template più recenti.** Una volta per sessione e per progetto, `rules-watch` confronta la versione di ogni modulo di regole con intestazione di versione (per ora `core.md` e `frontend.md`) tra il progetto e il template, solo per i moduli che il progetto ha. Se un modulo del template è più avanti, Claude riceve i moduli con le versioni e i file diversi e deve proporti l'allineamento con una sola domanda: non copia nulla senza il tuo ok. Una differenza di contenuto a parità di versione non viene segnalata (potrebbe essere una deroga voluta, da annotare in `CLAUDE.md`).
- **Cartella del template.** Si legge dalla variabile d'ambiente `KIT_CONFIG_TEMPLATE_DIR`, da impostare una volta per macchina con il percorso della cartella del template (per esempio nella sezione `env` di `~/.claude/settings.json`). Il plugin non ha un percorso di default: senza la variabile il confronto non parte e Claude riceve un avviso che chiede il percorso. Se la cartella non esiste o non contiene `.claude/rules`, Claude riceve un avviso (una volta per sessione) e ti chiede il percorso corretto. Il confronto è saltato nel template stesso e nei progetti senza file di regole.

## Versione del plugin: promemoria di aggiornamento

Dalla versione 1.15.0. Il marketplace da cartella locale non si aggiorna da solo: finché non si lanciano i comandi di [Aggiornamento](#aggiornamento), ogni macchina resta sulla versione installata e le skill nuove (per esempio il campo `model`) non hanno effetto. Per non dimenticarlo, `prompt-start` confronta la versione del plugin in esecuzione con quella del template.

- **Quando.** Una volta per sessione e per progetto, in ogni progetto con il plugin attivo, anche senza `.claude/rules/`.
- **Cosa confronta.** `.claude-plugin/plugin.json` del plugin in esecuzione (`CLAUDE_PLUGIN_ROOT`) contro `plugins/kit/.claude-plugin/plugin.json` dentro `KIT_CONFIG_TEMPLATE_DIR`, con confronto numerico per segmenti (1.9.0 < 1.10.0).
- **Cosa succede.** Se il template ha una versione più recente, Claude te lo dice con una frase e suggerisce `/plugin marketplace update claude-config`, `/plugin update kit@claude-config` e `/reload-plugins`. Non esegue nulla e non modifica file.
- **Silenzio.** Senza `KIT_CONFIG_TEMPLATE_DIR`, con un file mancante o non valido, o a versioni uguali, non compare nulla (la domanda sul percorso la pone già il confronto delle regole).
- **Limite.** Compare solo dal primo aggiornamento che contiene il controllo: il primo aggiornamento resta manuale.

## Log dei modelli usati nella sessione

Dalla versione 1.16.0. Una sessione può usare più modelli: una skill con `model: haiku` fa girare il suo turno su Haiku mentre la sessione resta su Sonnet, e i subagent hanno un modello proprio. Per sapere chi ha fatto cosa, il plugin legge il registro della sessione (`~/.claude/projects/<progetto>/<sessione>.jsonl`), dove ogni risposta riporta il modello che l'ha generata (`message.model`), se viene da un subagent (`isSidechain`) e da quale skill è partita (`attributionSkill`). Non si usa il contesto del modello, che dice sempre il modello di inizio sessione (per questo la riga «Modello in uso» è stata rimossa).

- **Avviso automatico.** `session-close` mostra la sequenza una sola volta per sessione, appena nel registro compare più di un modello, con il rimando a `/kit:modelli`.
- **Comando `/kit:modelli`.** Mostra la stessa sequenza più il totale delle risposte per modello, quando vuoi.
- **Formato.** Una riga per ogni cambio di modello o di origine: ora locale, nome senza prefisso `claude-` e origine tra parentesi (`sessione`, `/plugin:skill` o `subagent`).
- **Limiti.** Il formato del registro è interno a Claude Code e non è documentato: se cambia o il file non è leggibile, l'avviso non compare e il comando lo dice. Il registro è scritto in modo asincrono e può non contenere l'ultimo turno.

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

Con la versione 1.15.0: promemoria automatico sulla versione del plugin (una volta per sessione e per progetto, se il template ha una versione più recente) e rimozione della riga «Modello in uso» dalle skill. Con la versione 1.16.0: il log dei modelli usati nella sessione, con il comando `/kit:modelli` e l'avviso al primo cambio di modello; il plugin ha ventidue comandi.

Con la versione 2.0.0 il plugin ha dodici comandi (da ventidue): i comandi di revisione tematica diventano `/kit:revisione <tema>`, `/kit:verifica-frontend` è assorbito da `/kit:verifica`, `/kit:aggiorna-docs` da `/kit:buonasera`, `/kit:review-regole` (già rinominato da `/kit:code-review`) da `/kit:revisione review-regole`. Breaking change: chi lanciava uno dei comandi rimossi deve usare il nuovo nome. Dopo l'aggiornamento, `/reload-plugins` o una nuova sessione. Nei progetti conviene `/kit:aggiorna-regole` per portare i moduli dei profili (`mini`, `standard`, `strutturato`).

Con la versione 2.0.1 `/kit:copia-regole` scrive nel `CLAUDE.md` il profilo scelto, nel campo «Profilo» (issue #73). Nessuna azione richiesta nei progetti già avviati; per un progetto copiato con la 2.0.0 il campo va impostato a mano o con `/kit:aggiorna-regole`.
Con la versione 3.0.0 le skill passano da dodici a dieci. Cambi incompatibili: `/kit:consegna` diventa `/kit:verifica` (checklist di consegna come sezione 0), e `/kit:copia-regole` e `/kit:aggiorna-regole` diventano `/kit:regole`, che copia le regole se il progetto non le ha e le aggiorna se le ha già. La domanda sul profilo è la prima dell'avvio; per il profilo `standard` le versioni brevi di cinque moduli stanno in `_template/rules-standard/`, con il testo completo in `rules-optional/dettaglio/`.

Con la versione 3.1.0 la lingua dei commenti di codice diventa l'italiano per default, con identificatori e messaggi di commit in inglese (ADR 0002, `core.md` §9).

Con la versione 3.2.0 arrivano lo script `regole.mjs` per copia, confronto, aggiornamento e rimozione dei file di regole (con `.bak` prima di ogni sostituzione), la skill `/kit:regole` che segue il profilo del `CLAUDE.md`, `checklist-mini.md` per il profilo `mini` e i test di copia per profilo. Il profilo `standard` non richiede più il threat model.

Con la versione 3.3.0 Git è in due moduli: `git-flusso.md` (anche PR e rilascio) e `core.md` §5c (regole minime). `git.md` e `git-avanzato.md` non esistono più: `/kit:regole` li rimuove nei progetti che li hanno, con `.bak` e un solo ok. Si aggiungono il modulo opzionale `mobile.md`, la sezione «GDPR operativo lato server» in `security-avanzata.md` e l'ADR 0003 (migrazioni come passo unico prima delle repliche). `operativita.md` si carica solo sui file `.github/**`.

Con la versione 3.4.0 le regole di sicurezza frontend (`frontend.md` §9) si caricano sempre sui file frontend, in ogni profilo: per un progetto frontend è un cambio di comportamento.

Con la versione 3.4.1 la descrizione del plugin è corretta: diceva «push e tag sempre consentiti», mentre push e tag richiedono il via dell'utente. Nessun cambio di comportamento.

Con la versione 3.5.0 arriva la sincronizzazione automatica delle regole all'avvio della sessione, spenta per default e attivabile per progetto (ADR 0004, controllo `session-start`); il manifesto dei moduli è `_template/moduli.json`.

Con la versione 3.6.0 arrivano la skill `/kit:rilascio` (undici comandi) e la divisione per area delle regole backend e frontend (`backend-regole.md`, `frontend-angular.md`, `frontend-sicurezza-test.md`), senza cambi alle regole.
