# Nautiquiz

Applicazione per esercitarsi con i quiz della patente nautica. Il repository è un **monorepo** (workspaces Bun: `api`, `ui`, pacchetti sotto `packages/`). Dataset di riferimento normativo: Allegato A MIT in [`sources/quiz-ministeriali/`](sources/quiz-ministeriali/README.md). In produzione: [nautiquiz.gufoe.it](https://nautiquiz.gufoe.it/).

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
| Catalogo risposte condiviso (tipi, correttezza, mappe generate) | [`packages/quiz-catalog/README.md`](packages/quiz-catalog/README.md) |
| Fonti ufficiali quiz MIT e note normative | [`sources/quiz-ministeriali/README.md`](sources/quiz-ministeriali/README.md) |

**Invarianti dati (sintesi):** il backend conserva le **risposte** come righe (utente, famiglia quiz, domanda, scelta, correttezza, istante) e, separatamente, **preferiti e segnalazioni** come tabelle sostituibili per utente (allineate a snapshot inviati dal client). Nel browser restano copie in `localStorage` per uso offline; dopo login gli storici e le liste vengono riallineati con il server. Se esisteva già progresso locale, l’utente può scegliere di importarlo sull’account. Le nuove risposte in assenza di rete restano in coda e si inviano in batch quando la connessione c’è. Il dettaglio dei flussi è nelle guide UI e API.

Il **manifest nella root** del monorepo espone script per sviluppo e build di UI e API, migrazioni database e **rigenerazione del catalogo** risposte dopo modifiche ai dati quiz; i nomi esatti sono quelli definiti lì.
