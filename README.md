# Nautiquiz

**Allenati per la patente nautica, una domanda alla volta.** Nautiquiz è un’applicazione web per esercitarsi con i quiz ministeriali, ripassare gli errori e tenere traccia dei propri progressi.

▶ **Prova l’app:** [nautiquiz.gufoe.it](https://nautiquiz.gufoe.it/)

## Cosa puoi fare

- Esercitarti con i quiz base, i quiz a vela e i carteggi 5D e 42D.
- Scegliere se svolgere tutti i quiz, concentrarti su quelli mancanti o sbagliati, oppure rivedere preferiti e domande segnalate.
- Consultare spiegazioni e immagini associate alle domande.
- Salvare i progressi nel browser e continuare a esercitarti anche offline; con un account, sincronizzare risposte e liste personali.
- Confrontare i risultati nella classifica settimanale.

## Dati e fonti

I quiz sono organizzati nell’app a partire dai documenti del Ministero delle Infrastrutture e dei Trasporti. I PDF originali, i relativi riferimenti e alcune note sul contesto normativo sono raccolti in [`sources/quiz-ministeriali/`](sources/quiz-ministeriali/README.md). L’app non è un servizio del MIT e non sostituisce i testi ufficiali, la formazione o le disposizioni vigenti: verifica sempre le informazioni aggiornate presso le fonti istituzionali.

## Avvio in locale

Il progetto usa [Bun](https://bun.sh/) e Docker Compose per avviare insieme interfaccia e API in ambiente di sviluppo. Dalla root del repository:

```sh
bun install
docker compose -f docker-compose.dev.yml up
```

Apri [http://localhost:9000](http://localhost:9000). L’interfaccia è disponibile sulla porta 9000 e l’API sulla 3333. La configurazione Compose usa valori adatti allo sviluppo: non riutilizzarli in produzione.

Per avviare i componenti separatamente, eseguire i test o lavorare sul database, consulta le guide dedicate.

## Struttura e documentazione

Il repository è un monorepo Bun con interfaccia, API e un pacchetto condiviso per il catalogo delle risposte corrette.

| Area | Descrizione |
| --- | --- |
| [`ui/`](ui/README.md) | Applicazione web Vue e Quasar, contenuti e flussi di studio |
| [`api/`](api/README.md) | API HTTP, autenticazione, sincronizzazione e persistenza |
| [`packages/quiz-catalog/`](packages/quiz-catalog/README.md) | Tipi condivisi e catalogo delle risposte attese |
| [`sources/quiz-ministeriali/`](sources/quiz-ministeriali/README.md) | Documenti di riferimento e note sulle fonti |

## Sviluppo

Le modifiche a domande e risposte devono mantenere allineati interfaccia e catalogo condiviso: la guida del [catalogo quiz](packages/quiz-catalog/README.md) descrive il flusso di generazione. Prima di contribuire, leggi la guida relativa all’area interessata e includi nella modifica l’aggiornamento della documentazione quando cambiano comportamento o configurazione.

## Licenza

Non è indicata una licenza per il repository. In assenza di una licenza esplicita, il codice non è automaticamente riutilizzabile o ridistribuibile: contatta i maintainer per informazioni.
