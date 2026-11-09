---
sidebar_position: 5
sidebar_label: Come funziona
---

# Come funziona

- Claude Code legge il `CLAUDE.md` nella root all'inizio di ogni sessione e carica da solo i moduli di `.claude/rules/` (nessun `@import`): quelli con `paths:` solo quando legge o modifica un file corrispondente. Con `/context` vedi cosa è caricato; un modulo con `paths:` compare con una riga `Loaded <percorso>` quando si attiva.

- Le regole dei moduli sono **globali e generali**. Ciò che è specifico di un progetto sta nel suo `CLAUDE.md`, che **prevale** in caso di conflitto. Una **deroga** a una regola si scrive nella sezione "Eccezioni alle regole globali" del `CLAUDE.md` di quel progetto, con il motivo: vale solo per quel progetto.

- Una deroga a un controllo automatico del plugin si scrive nel codice, sulla stessa riga o su quella sopra: `kit-allow: <id> — <motivo>` (`core.md` §6, punto 23).

- Nei moduli, "sempre", "mai", "vietato", "obbligatorio" sono regole non negoziabili (si derogano solo con la tua approvazione); "preferisci", "preferita", "valuta" sono default modificabili con un motivo dichiarato.

- Nei file del template non vanno mai scritti percorsi assoluti né nomi di altri progetti.

# Cosa chiede Claude e cosa fa da solo

**Chiede, sempre una domanda per volta** e attendendo la risposta (`core.md` §6.5):
- All'avvio: tipo di progetto, sicurezza, Docker, stato (nuovo o esistente), tecnologia frontend e mobile, ORM, file .NET di root, flusso per entità;

- Ogni volta che c'è un dubbio, un requisito ambiguo, un refactoring ampio, una licenza copyleft o una best practice nuova;

- Le scelte "chiesto, non presunto" del `CLAUDE.md` (architettura, libreria degli errori, database, sicurezza, cache, email, job in background, logging, lingua di `README.md` e `CHANGELOG.md`, ecc.), con le risposte registrate nel `CLAUDE.md` per non richiederle.

**Fa da solo:**
- Scrive il piano in `PIANO.md` prima di ogni lavoro sostanzioso; per una modifica piccola e ovvia (un file, pochi punti, nessuna decisione aperta) dice in chat cosa cambia e procede senza piano (se ne hai già uno, lo verifica contro le regole: conflitti e mancanze si chiedono una per volta) ed esegue **un punto alla volta**, con il tuo ok a ogni passo;

- Verifica build, test e (se toccati) `docker compose config` prima di dichiarare concluso un compito, e riporta gli errori così come sono;

- Dichiara nome, versione e motivo di ogni nuova dipendenza e segnala le richieste che violano le regole proponendo l'alternativa conforme;

- Aggiorna `README.md` e `CHANGELOG.md` a ogni passo del piano.

- Annota in `CHECKLIST.md` bug e miglioramenti che trova lavorando, senza interrompere il lavoro (`core.md` §6, punti 20-22).

**Riprendere la giornata:** con il plugin, `/kit:buonasera` salva in `PIANO.md` lo stato dei lavori e in `CHECKLIST.md` i problemi nuovi, e stampa il comando da lanciare la volta dopo. `/kit:buongiorno` rilegge quei file, riassume dove si è arrivati e propone il primo passo, senza modificare nulla. Entrambi partono solo se li lanci tu.

**Git:** segue il git flow completo, con `develop` obbligatorio in ogni progetto (se manca, ti chiede se può crearlo da `main`), conferma il branch con te a ogni lavoro, non committa su `main` o `develop` senza una tua deroga, presenta il piano dei commit e ne crea **uno alla volta** con il tuo ok. Esegue solo commit locali: l'inizializzazione del repository resta a tuo carico. Push e tag li esegue su tua richiesta o con tua conferma; PR e rilasci con `gh` solo se la GitHub CLI è dichiarata installata nel `CLAUDE.md` (riga «GitHub CLI (gh) installata»). Una pipeline la avvia solo dopo una tua domanda di conferma per ogni esecuzione. Con il [plugin `kit`](plugin.md) installato questi divieti e la regola della domanda unica sono applicati anche tecnicamente, non solo scritti. Anche i segreti in configurazione, i pattern vietati nel codice e le pratiche di qualità sono controllati dal plugin: i blocchi fermano l'operazione, gli avvisi e i promemoria restano visibili a Claude e a te.

**Deploy:** sempre con `Dockerfile` e `docker-compose` (`docker.md`). Database (SQL Server o PostgreSQL) e nginx come reverse proxy sono già sul server: Claude non genera configurazioni per loro. I server li gestisci tu; Claude produce gli artefatti (file base, `override`, `prod`, `.env.example`) ma non configura host, rete o TLS.
