---
sidebar_position: 1
sidebar_label: Introduzione
---

# Template di progetto per Claude Code

Repository di partenza per i nuovi progetti sviluppati con [Claude Code](https://claude.com/claude-code).

Contiene le regole di sviluppo (stack .NET + Angular, git flow, sicurezza, Docker come modulo opzionale) già organizzate nel formato che Claude Code carica da solo, più un `CLAUDE.md` da compilare per il progetto.

Le regole sono in italiano; codice, identificatori e messaggi di commit che ne derivano sono in inglese.

## Documentazione

| Documento | Contenuto |
|---|---|
| [Come si usa, nei dettagli](uso.md) | Quale caso è il tuo (progetto nuovo, esistente senza regole, esistente con regole), il template come cartella a parte, `/kit:copia-regole` e `/kit:aggiorna-regole`, moduli da tenere per tipo di progetto |
| [Plugin `kit`](plugin.md) | Tredici controlli personali, in sei script (blocchi, avvisi e promemoria su comandi, segreti, pattern vietati, piano, regole aggiornate, sito di documentazione) e diciannove comandi `/kit:...`: installazione, aggiornamento, migrazione |
| [Cosa contiene](contenuto.md) | Struttura del repository, moduli delle regole, cartella `_template/` e plugin |
| [Come funziona](funzionamento.md) | Caricamento delle regole, deroghe, cosa chiede Claude e cosa fa da solo |
| [Manutenzione](manutenzione.md) | Verifiche periodiche, risoluzione dei problemi, punti aperti, aggiornamento del template |

## Come si usa, in breve

Le regole non si "installano": si **copiano nel progetto** e Claude Code le legge da solo.

Servono sempre due cose, che Claude prepara per te se glielo chiedi:

1. la cartella `.claude/rules/` con i moduli scelti (almeno `core.md` e `git.md`);
2. un `CLAUDE.md` nella root del progetto, compilato con le scelte di quel progetto (database, architettura, ecc.).

Non devi fare altro che aprire Claude Code nella cartella del progetto e scrivere una frase (qui sotto indicata).

Claude ti fa le domande **una alla volta**, scrive il piano in `PIANO.md` (per i lavori sostanziosi, non per le modifiche piccole) e va avanti **un passo per volta**, con il tuo ok a ogni passo. I problemi che trova lavorando li annota in `CHECKLIST.md`, senza interrompere il lavoro.

| Situazione | Cosa scrivere a Claude |
|---|---|
| Progetto nuovo | *"Avvia un nuovo progetto"* |
| Progetto già avviato, tutte le regole | *"Applica le regole in `<percorso del template>` a questo progetto esistente"* |
| Progetto già avviato, dopo aver copiato le regole con `/kit:copia-regole` | *"Applica le regole di questo progetto"* (senza percorso) |
| Progetto già avviato, solo branch e commit | *"Integra solo le regole Git in questo progetto, con le regole in `<percorso del template>`"* |
| Aggiungere un modulo più avanti | *"Aggiungi il modulo `<nome>`"* o il comando `/kit:copia-regole` |
| Allineare il progetto al template aggiornato | *"Riallinea le regole"* o il comando `/kit:aggiorna-regole` |

Per i casi particolari vedi [Come si usa, nei dettagli](uso.md).

Claude non fa mai `git init`. Push e tag sono consentiti sempre; PR e rilasci passano da `gh` solo se la GitHub CLI è dichiarata installata nel `CLAUDE.md` (vedi [Integrazione GitHub](plugin.md#integrazione-github)). Claude li esegue solo su tua richiesta o con tua conferma. Per i commit fa solo commit locali, e, fuori dalle skill `/kit:commit-passo`, `/kit:pr-develop` e `/kit:pr-main` (il cui lancio è il via libera), solo dopo il tuo ok; il branch di lavoro lo crea da solo. Il [plugin `kit`](plugin.md) rende tecnici molti di questi divieti (comandi, segreti, pattern vietati) e la regola della domanda unica; le pratiche che richiedono giudizio arrivano come avvisi. Si installa una volta per macchina:

```
claude plugin marketplace add AngeloDotNet/claude-config
claude plugin install kit@claude-config
```
