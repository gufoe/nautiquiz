# Nautiquiz — Backend (API)

## Scopo

Servizio HTTP per autenticazione, invio in batch delle risposte ai quiz, lettura degli storici per tipo quiz e classifiche; persistenza su SQLite con migrazioni versionate. Le famiglie di quiz (`base`, `vela`, `5d`, `42d`) e la validazione delle stringhe `quiz_kind` sono allineate al [catalogo condiviso](../packages/quiz-catalog/README.md) importato come dipendenza.

## Invarianti dati

- **`answers`**: una riga per ogni risposta accettata (utente, `quiz_kind`, `question_id`, indice scelto, correttezza, timestamp). Classifiche e storici per tipo quiz si derivano da questa tabella.
- **`quiz_issue_reports`** (segnalazioni) e **`quiz_favorites`** (preferiti): insiemi di id domanda per utente e per famiglia quiz; il client invia uno snapshot completo con **`PUT /quiz-lists`** (corpo con `favorites` e `issues`, ciascuno con le quattro famiglie e array di interi). Il server **sostituisce** tutte le righe dell’utente in quelle due tabelle a ogni sync, così l’analisi SQL resta semplice e coerente con lo stato dichiarato dal client.
- **`GET /quiz-lists`** restituisce lo stesso formato per allineare il browser dopo login.
- Il batch **`POST /quiz-attempts/batch`** accetta solo righe con **`is_correct`** booleano; id univoco per riga per deduplicare i reinvii. La logica di validazione delle famiglie quiz sulle route e sui JSON è la stessa usata nel catalogo condiviso (`isQuizKind`, elenco `QUIZ_KINDS`).
- Il **catalogo delle risposte attese** è lo stesso della UI (pacchetto `packages/quiz-catalog`, mappe generate dagli array quiz nel client). Serve a ricalcolare la correttezza lato server dove serve (es. script di **backfill** sul database di produzione o di manutenzione). Per riallineare **`answers.is_correct`** dopo correzioni ai dati quiz o migrazioni, usare lo script di backfill indicato nel manifest del package API; percorso database come negli altri script operativi che leggono SQLite.

## Collegamenti

- Indice repository: [README principale](../README.md)
- Frontend: [guida UI](../ui/README.md)
- Catalogo condiviso (correttezza, tipi): [packages/quiz-catalog](../packages/quiz-catalog/README.md)
- Dataset ministeriale (contesto normativo delle domande): [quiz ministeriali](../sources/quiz-ministeriali/README.md)

## Responsabilità

- API REST (framework Hono) con CORS verso origini UI configurate tramite ambiente.
- Persistenza tramite Drizzle ORM e SQLite; migrazioni nella cartella dedicata del package.
- Sicurezza: password e token secondo le librerie del progetto; test end-to-end presenti nella cartella test del package (avviare la suite con lo script del package così che variabili e DB di test siano impostati dal preload).

## Operazioni

- Sviluppo: dalla root del monorepo si avvia lo script di sviluppo della cartella `api` (watch sul codice sorgente).
- Avvio diretto: entrypoint principale nel sorgente TypeScript del package; porta e variabili d’ambiente documentate implicitamente nel codice e nel deploy.
- Database: generazione e applicazione migrazioni tramite script `db:*` nel manifest del package; eventuale studio schema tramite lo strumento indicato negli script. Se la tabella **`answers`** risulta incoerente (es. tutte le righe attribuite a un solo utente) ma esiste ancora **`question_attempts`** oppure un backup SQLite antico con quella tabella, lo script **`db:repair-answers`** nel package (vedi intestazione del file sotto `scripts/`) ricostruisce **`answers`** dalla fonte corretta; in produzione usare solo dopo backup del volume database.
- Test: suite e2e invocabile dallo script di test del package; la root può offrire un comando che esegue i test in container per ambienti isolati.

## Allineamento

Aggiorna questa guida quando cambiano route o contratti API, modello dati o migrazioni, variabili d’ambiente richieste, stack runtime (Bun, dipendenze principali), oppure quando cambiano il catalogo condiviso o gli script operativi (`db:*`, backfill, dump liste). Aggiorna anche la guida UI se il frontend deve adattarsi.
