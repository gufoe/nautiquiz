# Nautiquiz — Catalogo risposte (pacchetto condiviso)

## Scopo

Fornisce a **UI** e **API** le stesse mappe “id domanda → indice risposta corretta” per le famiglie di quiz (`base`, `vela`, `5d`, `42d`), più costanti condivise (`QUIZ_KINDS`, `isQuizKind`, ecc.). Evita divergenze tra ciò che il client considera giusto e ciò che il server può ricalcolare (import, backfill, migrazioni).

## Collegamenti

- Indice repository: [README principale](../../README.md)
- Frontend (origine dei dati quiz): [guida UI](../../ui/README.md)
- Backend (persistenza risposte, script di backfill): [guida API](../../api/README.md)

## Responsabilità

- Tenere **un solo posto** per l’elenco delle famiglie di quiz e per la validazione delle stringhe `quiz_kind`.
- Esporre funzioni pure per sapere se una scelta è corretta, in base al file JSON generato dagli array del client.
- Non contenere testi delle domande o asset: solo indici e metadati minimi per la correttezza.

## Operazioni

- Il file JSON compattato nel sorgente del pacchetto è **generato** a partire dagli array definiti nella UI (`ui/src/data/quiz.ts`), non editato a mano.
- Dalla **root del monorepo** va eseguito lo script denominato **catalog** nel manifest principale dopo ogni modifica sostanziale alle domande o alle risposte attese; poi si committa l’output così che API e build UI restino allineate.

## Allineamento

Aggiorna questa guida se cambia il flusso di generazione, il nome dello script nel manifest root, o se il pacchetto inizia a esporre altri tipi condivisi oltre alle mappe di correttezza.
