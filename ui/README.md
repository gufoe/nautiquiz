# Nautiquiz — UI

## Scopo

Client web per quiz patente nautica: interfaccia utente, navigazione tra modalità di studio e collegamento al backend per autenticazione, stato sincronizzato e classifiche.

## Collegamenti

- Indice repository: [README principale](../README.md)
- Backend: [guida API](../api/README.md)
- Catalogo risposte condiviso (generazione, correttezza): [packages/quiz-catalog](../packages/quiz-catalog/README.md)
- Dataset e note su fonti ministeriali: [quiz ministeriali](../sources/quiz-ministeriali/README.md)

## Responsabilità

- Esperienza utente e presentazione dei contenuti quiz (inclusi asset pubblici legati alle domande).
- Chiamate al servizio HTTP documentato nella guida API; gestione auth lato client in linea con i contratti del backend.
- Build statica tramite toolchain Quasar (Vite).
- Definizione degli **array quiz** nel codice sorgente della UI: sono la fonte da cui si genera il [catalogo condiviso](../packages/quiz-catalog/README.md) usato anche dal backend per correttezza e manutenzione.

## Invarianti sync (offline e server)

- **Storico risposte** (mappa domanda → scelta): primariamente nel **browser** (`localStorage`); il server mantiene lo storico consolidato per account e lo espone dopo login. Senza rete l’app resta utilizzabile; le risposte nuove entrano in **coda** e vanno al server in batch quando possibile.
- **Preferiti e segnalazioni**: stesso modello “prima locale” per reattività e offline; il client invia periodicamente uno **snapshot completo** con **`PUT /quiz-lists`**, e il server li persiste in tabelle dedicate per analisi (vedi guida API). Dopo login, **`GET /quiz-lists`** e **`GET /quiz-histories`** riallineano il browser.
- **Correttezza** rispetto al catalogo: import da storico locale e invii in batch usano le stesse regole del pacchetto condiviso, così client e server non divergono sul “giusto/sbagliato”.
- Dopo login, se c’era già progresso locale, viene chiesto se **importarlo** sull’account.

## Operazioni

- Sviluppo: dalla root del monorepo si usa lo script di sviluppo dedicato alla cartella `ui` (vedi manifest nella root); la UI è servita in sviluppo sulla porta configurata da Quasar (tipicamente diversa dalla API).
- Build di produzione: lo script di build del package `ui` (invocabile anche dalla root) esegue prima la preparazione Quasar che rigenera la cartella di supporto ignorata dal versionamento; l’output di produzione resta nella directory di build del progetto Quasar.
- Qualità: lint e formattazione sono definiti negli script del package `ui`.
- Dopo modifiche agli array quiz: dalla root eseguire lo script di **rigenerazione catalogo** indicato nel manifest principale, così il pacchetto condiviso e le mappe JSON restano coerenti (vedi [catalogo](../packages/quiz-catalog/README.md)).

## Allineamento

Aggiorna questa guida quando cambiano framework UI, porte o flussi di build, quando evolve il contratto con l’API (endpoint, auth, CORS), quando cambiano le regole di sync o il significato di preferiti/segnalazioni lato server, oppure quando la struttura delle pagine e delle risorse pubbliche smette di corrispondere a quanto descritto sopra.
