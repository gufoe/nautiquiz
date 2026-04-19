# Nautiquiz — UI

## Scopo

Client web per quiz patente nautica: interfaccia utente, navigazione tra modalità di studio e collegamento al backend per autenticazione, stato sincronizzato e classifiche.

## Collegamenti

- Indice repository: [README principale](../README.md)
- Backend: [guida API](../api/README.md)
- Dataset e note su fonti ministeriali: [quiz ministeriali](../sources/quiz-ministeriali/README.md)

## Responsabilità

- Esperienza utente e presentazione dei contenuti quiz (inclusi asset pubblici legati alle domande).
- Chiamate al servizio HTTP documentato nella guida API; gestione auth lato client in linea con i contratti del backend.
- Build statica tramite toolchain Quasar (Vite).

## Invarianti sync (offline)

- Progressi, preferiti e segnalazioni vivono nel **browser** (`localStorage`); senza rete l’app resta utilizzabile come prima.
- Le risposte nuove entrano in una **coda** e vanno al server in batch quando la connessione c’è; allo stesso modo, dopo ogni sync (e al tornare **online** o con la scheda visibile) il client invia **`PUT /quiz-lists`** con preferiti e segnalazioni correnti.
- Dopo login, il client scarica storici risposte e liste server (**`GET /quiz-histories`** e **`GET /quiz-lists`**) e aggiorna il `localStorage`; se c’erano già dati locali, viene chiesto se importarli sull’account.

## Operazioni

- Sviluppo: dalla root del monorepo si usa lo script di sviluppo dedicato alla cartella `ui` (vedi manifest nella root); la UI è servita in sviluppo sulla porta configurata da Quasar (tipicamente diversa dalla API).
- Build di produzione: script di build UI invocabile dalla root; output nella directory di build Quasar del progetto.
- Qualità: lint e formattazione sono definiti negli script del package `ui`.

## Allineamento

Aggiorna questa guida quando cambiano framework UI, porte o flussi di build, quando evolve il contratto con l’API (endpoint, auth, CORS) o quando la struttura delle pagine e delle risorse pubbliche smette di corrispondere a quanto descritto sopra.
