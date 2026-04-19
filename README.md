# Nautiquiz

Applicazione per esercitarsi con i quiz della patente nautica. Dataset di riferimento in repository: Allegato A MIT (elenco nazionale quesiti D1) in [`sources/quiz-ministeriali/`](sources/quiz-ministeriali/README.md). In produzione: [nautiquiz.gufoe.it](https://nautiquiz.gufoe.it/).

---

## Guide maintenance (read this before editing docs)

Questa sezione definisce come scrivere e aggiornare guide e README nel repo, in modo che restino utili sia alle persone sia agli agenti che navigano il progetto.

### Principles

- **High level.** Descrivi ruolo, confini e flussi; evita elenchi di file, nomi di simboli o passi da manuale salvo quando servono davvero a orientarsi.
- **Cross linked.** Ogni guida punta al contesto padre (README radice) e alle guide sorelle (UI, API, dataset). La radice resta l’indice; non duplicare paragrafi interi tra file.
- **No code.** Niente blocchi di codice, snippet di terminale o configurazione nelle guide. Indica *cosa* fare (es. “avvia lo script di sviluppo UI dal package root”) e rimanda agli script reali nel codice o al README della cartella se serve il dettaglio operativo minimo in una riga.
- **Semistructured.** Usa sempre la stessa intelaiatura (titolo → scopo → collegamenti → responsabilità / operazioni → note di allineamento) così strumenti e agenti possono agganciare sezioni in modo prevedibile. Sottosezioni brevi battono paragrafi unici lunghi.
- **After code changes.** Se modifichi comportamento, dipendenze, percorsi o contratti (API, env, build), aggiorna nella stessa PR (o subito dopo) la guida della cartella toccata e, se l’impatto è trasversale, una riga nell’indice in questa pagina.

### Default outline for package guides

1. **Scopo** — cosa copre la cartella e cosa esclude.
2. **Collegamenti** — link alla radice, alle altre guide rilevanti e a dataset o deploy se servono.
3. **Responsabilità** — ruolo nel sistema (es. solo client, solo HTTP, solo dati).
4. **Operazioni** — come si sviluppa e si builda in linguaggio naturale; niente comandi copiabili in blocco.
5. **Allineamento** — quando e perché aggiornare questa guida (trigger legati al codice).

---

## Documentation index

| Area | Guida |
|------|--------|
| Frontend (Quasar / Vue) | [`ui/README.md`](ui/README.md) |
| Backend API (Bun / Hono) | [`api/README.md`](api/README.md) |
| Catalogo risposte attese (pacchetto condiviso UI/API) | Cartella `packages/quiz-catalog`: mappe id→indice corretto generate dagli array in `ui/src/data/quiz.ts`; dalla root del monorepo lo script di rigenerazione è quello denominato catalog nel manifest principale. |
| Fonti ufficiali quiz MIT e note normative | [`sources/quiz-ministeriali/README.md`](sources/quiz-ministeriali/README.md) |

**Invarianti dati (sintesi):** il backend conserva solo righe di risposta (utente, quiz, domanda, scelta, correttezza, istante). Preferiti e segnalazioni restano nel browser. Dopo login, se c’è progresso locale viene chiesto se importarlo. Le risposte fatte offline vanno in coda e si inviano al server appena c’è connessione. Dettaglio nelle guide API e UI.

Il **package root** orchestra script condivisi (sviluppo UI, sviluppo API, build, database): i dettagli sono nei README di `ui` e `api` e negli script del manifest root.
