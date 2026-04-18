# Nautiquiz — Backend (API)

## Scopo

Servizio HTTP che espone autenticazione utente, sincronizzazione di stato client, classifiche e operazioni correlate al quiz; persistenza su database gestito con migrazioni versionate.

## Collegamenti

- Indice repository: [README principale](../README.md)
- Frontend: [guida UI](../ui/README.md)
- Dataset ministeriale (contesto domande): [quiz ministeriali](../sources/quiz-ministeriali/README.md)

## Responsabilità

- API REST (framework Hono) con CORS verso origini UI configurate tramite ambiente.
- Persistenza tramite Drizzle ORM e SQLite; migrazioni nella cartella dedicata del package.
- Sicurezza: password e token secondo le librerie del progetto; test end-to-end presenti nella cartella test del package.

## Operazioni

- Sviluppo: dalla root del monorepo si avvia lo script di sviluppo della cartella `api` (watch sul codice sorgente).
- Avvio diretto: entrypoint principale nel sorgente TypeScript del package; porta e variabili d’ambiente documentate implicitamente nel codice e nel deploy.
- Database: generazione e applicazione migrazioni tramite script `db:*` nel manifest del package; eventuale studio schema tramite lo strumento indicato negli script.
- Test: suite e2e invocabile dallo script di test del package; la root può offrire un comando che esegue i test in container per ambienti isolati.

## Allineamento

Aggiorna questa guida quando cambiano route o contratti API, modello dati o migrazioni, variabili d’ambiente richieste, o stack runtime (Bun, dipendenze principali). Aggiorna anche la guida UI se il frontend deve adattarsi.
