---
sidebar_position: 2
sidebar_label: Come si usa
---

# Come si usa, nei dettagli

La premessa e la tabella delle frasi da scrivere a Claude sono nella [pagina iniziale](intro.md#come-si-usa-in-breve). Qui i passi per ogni situazione.

## Quale caso è il tuo?

| Situazione | Cosa fai | Comando |
|---|---|---|
| [Progetto nuovo](#progetto-nuovo) | Crei il repository dal template, apri Claude Code nella cartella e scrivi *"Avvia un nuovo progetto"* | `/kit:avvia-progetto` (oppure la frase, senza comando) |
| [Progetto esistente senza regole](#progetto-esistente-senza-regole) | `/kit:copia-regole` in Claude Code, dentro il progetto; poi *"Applica le regole di questo progetto"* | `/kit:copia-regole` |
| [Progetto esistente con regole già presenti](#progetto-esistente-con-regole-già-presenti) | `git pull` nel template, `/kit:aggiorna-regole` in Claude Code, dentro il progetto; poi *"Riallinea le regole"* | `/kit:aggiorna-regole` |

I comandi copiano i file in modo meccanico; le domande, le ispezioni e il `CLAUDE.md` sono di Claude. Il percorso del template non si scrive: lo legge dalla variabile d'ambiente `KIT_CONFIG_TEMPLATE_DIR`, impostata una volta per macchina (vedi [Plugin `kit`](plugin.md#regole-aggiornate-cosa-controlla-rules-watch)). I comandi richiedono il plugin `kit` installato ([Installazione](plugin.md#installazione)). Dettagli in [Comandi di copia e aggiornamento](#comandi-di-copia-e-aggiornamento).

## Progetto nuovo

1. Crea il repository dal template (su GitHub: **Use this template**) oppure copia i file in una cartella nuova, **senza** la cartella `.git` del template.

2. Apri Claude Code in quella cartella e scrivi: *"Avvia un nuovo progetto"*.

3. Rispondi alle domande di avvio (tipo di progetto, sicurezza, Docker, frontend, ORM, ecc.).

4. Alla fine Claude ha: spostato i moduli non scelti da `.claude/rules/` a `rules-optional/`, spostato gli opzionali confermati da `rules-optional/` a `rules/`, compilato `CLAUDE.md` ed eliminato il materiale del template che non serve al progetto (`_template/`, `.claude-plugin/`, `plugins/`; restano `.claude/rules/` e `.claude/rules-optional/` per le modifiche successive alle regole; `README.md` e `CHANGELOG.md` del template si sostituiscono con quelli del progetto). Controlla con `/context` che i moduli all'avvio risultino caricati.

I tre moduli backend (`backend.md`, `backend-architecture.md`, `backend-app.md`) si spostano sempre insieme.

### Che cosa resta in base al tipo di progetto

| Tipo | Moduli in `.claude/rules/` | File di root da tenere |
|---|---|---|
| Fullstack (API + Angular) | `core`, `git`, i tre `backend`, `frontend` (+ `feature-workflow` se lo confermi) | `.editorconfig`, `NuGet.config` |
| Solo API | `core`, `git`, i tre `backend` | `.editorconfig`, `NuGet.config` |
| Solo frontend | `core`, `git`, `frontend` | nessuno dei due file .NET: eliminarli |
| Solo Git | `core`, `git` | nessuno dei due file .NET: eliminarli |

In tutti i casi `security` e `docker` si tengono solo se li scegli, e `backend-email` / `backend-infra` si attivano più avanti, quando servono. `.gitattributes` e `.gitignore` restano sempre. Nei progetti senza backend .NET non c'è un file di configurazione per il frontend nel template: lint e formattazione si decidono nel progetto Angular.

## Progetto esistente senza regole

Il repository del progetto non cambia e non riceve il template: le regole si copiano da una **copia del template tenuta a parte** (vedi [Il template come cartella a parte](#il-template-come-cartella-a-parte)). Vale anche se il repository è già su GitHub: "Use this template" funziona solo per repository nuovi.

**Strada A, con il comando `/kit:copia-regole`:**

1. Aggiorna la copia del template (`git pull`).
2. Apri Claude Code nella cartella del progetto e scrivi `/kit:copia-regole`. Per un progetto solo Git (senza backend, frontend, Docker o sicurezza) rispondi «sì» alla domanda «solo regole Git?»: si copiano solo `core.md` e `git.md`, e il comando chiede solo `CLAUDE.md`, `.gitignore` e `.gitattributes`. Altrimenti il comando chiede, una domanda alla volta, quali moduli facoltativi includere e, a richiesta, i file di root (`CLAUDE.md`, `NuGet.config`, `.editorconfig`, `.gitignore`, `.gitattributes`); copia anche la procedura di avvio in `_template/avvio-progetto.md` del progetto. Se il progetto ha già `.claude/rules/`, si ferma e ti indica `/kit:aggiorna-regole`.
3. Nella stessa sessione scrivi: *"Applica le regole di questo progetto"* (senza percorso). Il `CLAUDE.md` e le deroghe richiedono comunque Claude (punti 4-7 sotto).

**Strada B, senza comandi:** apri Claude Code nella cartella del progetto e scrivi, con il percorso del template:
   - tutte le regole: *"Applica le regole in `<percorso del template>` a questo progetto esistente"*;
   - solo git (branch e commit): *"Integra solo le regole Git in questo progetto, con le regole in `<percorso del template>`"*.

Da qui il lavoro è di Claude, sia con la strada A sia con la B:

4. **Guarda, senza modificare nulla:** legge git e codice e ti mostra dove il progetto si discosta dalle regole.

5. **Per ogni differenza ti chiede una scelta, una alla volta:** annotarla come **deroga** nel `CLAUDE.md` (il progetto resta com'è) oppure **adeguare il progetto** con un refactoring pianificato in `PIANO.md`. Non riscrive la cronologia git né ristruttura il codice da solo.

6. **Poi copia** in `.claude/rules/` del progetto solo i moduli scelti (se non lo ha già fatto il comando), crea il `CLAUDE.md` con ciò che ha rilevato e propone un commit locale `chore(rules)`, che crea solo dopo il tuo ok. Il `push` e la PR restano a tua scelta: Claude li esegue solo se lo chiedi (vedi [Plugin](plugin.md#integrazione-github)).

7. Controlla con `/context` che le regole risultino caricate.

Se il progetto ha già un `CLAUDE.md` o una cartella `.claude/`, ricordati di dirlo: nel dubbio Claude si ferma e ti chiede come procedere (unire o tenere l'esistente), senza sovrascrivere nulla senza il tuo ok.

Se il progetto ha un frontend Blazor da sostituire con Angular, esiste una procedura dedicata (`_template/avvio-progetto.md` §3d).

## Progetto esistente con regole già presenti

Il progetto contiene già `.claude/rules/` e un `CLAUDE.md`: sono copie delle regole del template e non serve rifare l'avvio. Per aggiornarle:

1. Aggiorna la copia del template (`git pull`).
2. Apri Claude Code nella cartella del progetto e scrivi `/kit:aggiorna-regole`. Il comando confronta i moduli già presenti nel progetto (in `.claude/rules/` e in `.claude/rules-optional/`) con quelli del template, ti mostra quelli diversi e per ciascuno chiede conferma, salvando il vecchio come `.bak`. Se il progetto ha `backend.md`, propone di aggiungere i moduli backend mancanti (`backend-architecture.md`, `backend-app.md`), accanto a `backend.md`, chiedendo conferma.
3. Nella stessa sessione scrivi: *"Riallinea le regole"*. Il comando non tocca il `CLAUDE.md` del progetto: i suoi rimandi e l'elenco dei moduli li allinea Claude.

In alternativa al comando, scrivi direttamente a Claude *"Riallinea le regole"* indicando il percorso del template.

Per aggiungere un modulo che il progetto non ha: `/kit:copia-regole`, oppure *"Aggiungi il modulo `<nome>`"*. `/kit:aggiorna-regole` aggiorna soltanto ciò che c'è già e, per i moduli assenti, stampa «[nuovo]».

## Il template come cartella a parte

Per i progetti esistenti il template vive **fuori da ogni progetto**, per esempio in `C:\Template\ClaudeCode`: clonalo una volta (senza collegarlo ai repository dei progetti) e aggiornalo con `git pull` prima di ogni uso.

- **Percorso del template per i comandi:** si imposta una volta per macchina nella variabile d'ambiente `KIT_CONFIG_TEMPLATE_DIR` (vedi [Plugin `kit`](plugin.md#regole-aggiornate-cosa-controlla-rules-watch)). Senza di essa i comandi non sanno dove leggere il template e si fermano.
- **Il percorso del progetto** è la cartella in cui apri Claude Code: i comandi di copia e aggiornamento lavorano lì. I comandi rifiutano un progetto che coincide con la cartella del template.
- **Repository già su GitHub:** non serve cambiarlo né ricrearlo. Cloni il repository del progetto in locale, applichi le regole come sopra, fai il commit `chore(rules)` e il `push`.
- **Percorso del template per Claude:** serve nelle frasi della strada B e per aggiungere un modulo o riallineare le regole; la cartella deve essere completa, `_template/` compresa.

### Dove Claude trova la procedura

Quando scrivi una di queste frasi, Claude legge `_template/avvio-progetto.md` e la segue (domande, ispezioni, scelta dei moduli, `CLAUDE.md`, piano). Tu non devi aprirla né citarla. In un progetto nuovo è nella copia del template; in un progetto esistente è nel progetto stesso se hai usato `/kit:copia-regole`, altrimenti la legge dalla cartella del template che gli indichi. I comandi di copia non sostituiscono la procedura: copiano soltanto i file, senza domande né ispezioni.

## Comandi di copia e aggiornamento

| Comando | Tipo di progetto | Cosa fa |
|---|---|---|
| `/kit:copia-regole` | Progetto esistente senza regole | Copia `core.md` e `git.md` in `.claude/rules/`; con «sì» alla domanda «solo regole Git?» si ferma qui, chiedendo solo `CLAUDE.md` (se manca), `.gitignore` e `.gitattributes`. Altrimenti chiede, una per volta, i moduli facoltativi (sicurezza, backend come tre moduli insieme, frontend, Docker, e i moduli di `rules-optional/`). Chiede poi, uno per file, i file di root `CLAUDE.md` (copiato solo se manca), `NuGet.config`, `.editorconfig`, `.gitignore` e `.gitattributes`. Copia anche `_template/avvio-progetto.md` nel progetto. Non crea commit |
| `/kit:aggiorna-regole` | Progetto con regole già presenti | Confronta i moduli del progetto (in `.claude/rules/` e in `.claude/rules-optional/`) con il template e mostra quelli diversi. Ogni file si sovrascrive solo con la tua conferma, e il vecchio resta come `.md.bak`. Se il progetto ha `backend.md`, propone i due moduli backend mancanti. I moduli assenti non si aggiungono da soli; i file di root, `CLAUDE.md` compreso, non si toccano. Non crea commit |

- Non tocca mai `PIANO.md` né altri file del progetto, e non committa nulla (il commit `chore(rules)` lo propone Claude, dopo il tuo ok).
- Il `CLAUDE.md` si copia **solo se manca**: è il modello con i campi `[..]`, che Claude compila poi con le domande di avvio. Se il progetto ne ha già uno, il comando non lo tocca e Claude lo allinea alle regole senza sostituirlo.
- `/kit:copia-regole` si ferma se il progetto ha già `.claude/rules/`: in quel caso va usato `/kit:aggiorna-regole`.
- `NuGet.config` e `.editorconfig` servono solo ai progetti con backend .NET.
- Entrambi i comandi sono sempre su richiesta: non partono da soli. Il template in `KIT_CONFIG_TEMPLATE_DIR` deve essere completo (vedi sopra).
