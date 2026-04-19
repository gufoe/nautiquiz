# Nautiquiz — Backend (API)

## Scopo

Servizio HTTP per autenticazione, invio in batch delle risposte ai quiz, lettura degli storici per tipo quiz e classifiche; persistenza su SQLite con migrazioni versionate.

## Invarianti dati

- **`answers`**: una riga per ogni risposta inviata (utente, `quiz_kind`, `question_id`, indice scelto, correttezza, timestamp). Classifiche e storici per tipo quiz si derivano da questa tabella.
- **`quiz_issue_reports`** (segnalazioni) e **`quiz_favorites`** (preferiti): insiemi di id domanda per utente e per famiglia quiz; il client invia uno snapshot completo con **`PUT /quiz-lists`** (corpo con `favorites` e `issues`, ciascuno con chiavi `base` / `vela` / `5d` / `42d` e array di interi). Il server sostituisce tutte le righe dell’utente in quelle due tabelle, così l’analisi SQL resta semplice.
- **`GET /quiz-lists`** restituisce lo stesso formato per allineare il browser dopo login.
- Il batch **`POST /quiz-attempts/batch`** accetta solo righe con **`is_correct`** booleano; id univoco per riga per deduplicare i reinvii.
- Il catalogo delle risposte attese è condiviso con la UI tramite il pacchetto `packages/quiz-catalog` (mappe generate dagli array quiz nel client). Per riallineare **`answers.is_correct`** al catalogo attuale dopo correzioni ai dati o migrazioni, usare lo script di backfill indicato nel manifest del package (stesso database SQLite dell’API, variabile di percorso come per gli altri script operativi).

## Collegamenti

- Indice repository: [README principale](../README.md)
- Frontend: [guida UI](../ui/README.md)
- Dataset ministeriale (contesto domande): [quiz ministeriali](../sources/quiz-ministeriali/README.md)

## Responsabilità

- API REST (framework Hono) con CORS verso origini UI configurate tramite ambiente.
- Persistenza tramite Drizzle ORM e SQLite; migrazioni nella cartella dedicata del package.
- Sicurezza: password e token secondo le librerie del progetto; test end-to-end presenti nella cartella test del package (avviare la suite con lo script del package così che variabili e DB di test siano impostati dal preload).

## Operazioni

- Sviluppo: dalla root del monorepo si avvia lo script di sviluppo della cartella `api` (watch sul codice sorgente).
- Avvio diretto: entrypoint principale nel sorgente TypeScript del package; porta e variabili d’ambiente documentate implicitamente nel codice e nel deploy.
- Database: generazione e applicazione migrazioni tramite script `db:*` nel manifest del package; eventuale studio schema tramite lo strumento indicato negli script.
- Test: suite e2e invocabile dallo script di test del package; la root può offrire un comando che esegue i test in container per ambienti isolati.

## Allineamento

Aggiorna questa guida quando cambiano route o contratti API, modello dati o migrazioni, variabili d’ambiente richieste, o stack runtime (Bun, dipendenze principali). Aggiorna anche la guida UI se il frontend deve adattarsi.
