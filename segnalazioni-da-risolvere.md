# Segnalazioni — quiz da rivedere

Elenco generato dai flag **Segnalazioni** (`quiz-issues` / `vela-quiz-issues` / …) salvati nel client state sincronizzato sul server di produzione.

- **Origine dati:** SQLite `user_client_state.data_json` su host `gufoe`, volume Docker `nautiquiz_sqlite` → `/data/nautiquiz.sqlite`.
- **Aggregazione:** unione di tutti gli ID segnalati da ogni utente (deduplicati).
- **Dataset testi/risposte:** versione corrente del repo (`ui/src/data/quiz.ts`).
- **Generato:** 2026-04-18.

## Dettaglio per utente (sync)

| User ID | Base (`quiz-issues`) | Vela (`vela-quiz-issues`) |
| --- | --- | --- |
| `d41015d9-6b15-4d4c-a256-2695fe798f5e` | 45 id | 4 id |
| `6fb9d2b5-9d5e-4586-83da-1cd31908ece4` | 12 id | 0 id |

Per elenco ID grezzi per utente, rieseguire la query sul server o aggiornare `USERS_SNAPSHOT` in `ui/scripts/gen-segnalazioni-md.ts`.


---

## Patente nautica (base)

*Domande segnalate (uniche, ordinate per id): **54***

### ID 40

La sagola è:

*Senza figura.*

**Risposta indicata (indice):** 0 — una fune sottile per usi vari (cime di calaggio, ormeggi ausiliari, linee di ribaltamento in zattera, ecc.).

**Scelte:**
0. una fune sottile per usi vari (cime di calaggio, ormeggi ausiliari, linee di ribaltamento in zattera, ecc.).
1. una sartia volante.
2. la drizza di una vela.

**Spiegazione (app):**

La sagola è una fune sottile e resistente usata per legature leggere, cime di calaggio, linee ausiliarie e, in zattera, la linea di ribaltamento. Non va confusa con la sartia volante (parte dell'attrezzatura di un'imbarcazione a vela collegata all'albero) né con la drizza, che serve a issare le vele.

### ID 41

Cosa si intende per giardinetto?

*Senza figura.*

**Risposta indicata (indice):** 2 — la porzione terminale della parte esterna dello scafo, posto in prossimità della poppa (a dritta e a sinistra), con profilo spigoloso o tondeggiante.

**Scelte:**
0. la parte esterna convessa (a dritta e sinistra) in corrispondenza della prua.
1. la zona più esterna e centrale della poppa.
2. la porzione terminale della parte esterna dello scafo, posto in prossimità della poppa (a dritta e a sinistra), con profilo spigoloso o tondeggiante.

**Spiegazione (app):**

Il termine "giardinetto" si riferisce specificamente alla porzione terminale della parte esterna dello scafo, situata vicino alla poppa (parte posteriore della barca), sia a destra (dritta) che a sinistra (sinistra). Questa sezione dello scafo può avere un profilo sia spigoloso che tondeggiante. Il giardinetto è importante perché rappresenta un punto di riferimento cruciale per manovre e navigazione, in particolare per operazioni di ancoraggio e per determinare la direzione del vento relativo e del mare. Essendo una zona molto vicina alla poppa, influenza anche la stabilità idrodinamica e la distribuzione dei pesi nella barca.

### ID 111

Il timone avente tutta la pala a poppavia dell’anima è denominato:

*Senza figura.*

**Risposta indicata (indice):** 1 — ordinario.

**Scelte:**
0. compensato.
1. ordinario.
2. comune.

**Spiegazione (app):**

Il timone avente tutta la pala a poppavia dell'anima (asse di rotazione) è un timone non compensato, detto anche ordinario: tutta la superficie direzionale è a poppa dell'asse. Il timone compensato ha invece parte della pala a prua dell'asse per bilanciare le pressioni idrodinamiche e ridurre lo sforzo al timone.

### ID 160

Quale calcolo della quantità di carburante più riserva (S = spazio, V = velocità, C = consumo l/h, RIS = riserva, Q = quantità carburante in litri) è corretta?

*Senza figura.*

**Risposta indicata (indice):** 1 — S = 15 Miglia   C = 15 litri/h 15 Nodi   Q = 19,5 litri.

**Scelte:**
0. S = 20 Miglia V = 10 Nodi
1. S = 15 Miglia   C = 15 litri/h 15 Nodi   Q = 19,5 litri.
2. S = 8 Miglia     C = 20 litri/h Nodi   Q = 25 litri.

**Spiegazione (app):**

Per determinare se il calcolo della quantità di carburante più riserva è corretto, dobbiamo seguire alcuni passaggi logici e matematici:

1. **Determinare il tempo di navigazione**: Il tempo di navigazione (T) si calcola con la formula T = S / V, dove S è lo spazio percorso in miglia e V è la velocità in nodi (1 nodo = 1 miglio nautico per ora).

2. **Calcolare il consumo totale di carburante**: Il consumo totale di carburante (CT) si ottiene moltiplicando il tempo di navigazione (T) per il consumo orario (C). Quindi CT = T * C.

3. **Aggiungere la riserva di carburante**: Generalmente, si considera una riserva del 30% del consumo totale per sicurezza. Quindi, la quantità totale di carburante più riserva (Q) si calcola come Q = CT * 1.3.

Analizziamo le opzioni proposte:

1. **Opzione 1**: S = 20 Miglia, V = 10 Nodi
   - Calcolo del tempo di navigazione: T = 20 / 10 = 2 ore.
   - La formula per il consumo totale di carburante e la riserva non può essere verificata in questo caso perché manca il consumo orario (C).

2. **Opzione 2**: S = 15 Miglia, C = 15 litri/h, V = 15 Nodi, Q = 19,5 litri
   - Calcolo del tempo di navigazione: T = 15 / 15 = 1 ora.
   - Consumo totale di carburante senza riserva: CT = 15 litri/h * 1 ora = 15 litri.
   - Quantità totale di carburante inclusa la riserva: Q = 15 * 1.3 = 19,5 litri.
   - Q = 19,5 litri è corretto, quindi questa opzione risulta corretta.

3. **Opzione 3**: S = 8 Miglia, C = 20 litri/h, V = Nodi, Q = 25 litri
   - Manca la velocità (V) per calcolare correttamente il tempo di navigazione e, di conseguenza, non possiamo verificare il consumo totale né la riserva.

Conclusione: La risposta corretta è quella in cui i calcoli possono essere eseguiti e verificati correttamente con le informazioni fornite e risultano corretti secondo le formule descritte. L'opzione 2 soddisfa tutte queste condizioni.

### ID 161

Quale calcolo della quantità di carburante incluso l'incremento del 30% di sicurezza (S = spazio, V = velocità, C = consumo l/h, RIS = riserva, Q = quantità carburante in litri) è corretto?

*Senza figura.*

**Risposta indicata (indice):** 2 — S = 10 Miglia   V = 10 Nodi   C = 10 litri/h   Q = 13,0 litri.

**Scelte:**
0. S = 10 Miglia V = 15 Nodi
1. S = 4 Miglia     C = 10 litri/h 7 Nodi     Q = 15 litri.
2. S = 10 Miglia   V = 10 Nodi   C = 10 litri/h   Q = 13,0 litri.

**Spiegazione (app):**

Si calcola il tempo di navigazione \(T = S/V\) in ore, poi il consumo \(C_{\text{totale}} = T \times C\) (litri), infine la quantità con margine del 30%: \(Q = C_{\text{totale}} \times 1{,}30\).

- **Prima scelta:** manca il consumo orario \(C\): non si può completare il calcolo.
- **Seconda scelta:** \(T = 4/7\) h, consumo \(5{,}71\) litri circa, con il 30% diventa circa \(7{,}4\) litri: **non** coincide con i 15 litri indicati.
- **Terza scelta:** \(T = 10/10 = 1\) h, consumo 10 litri, \(Q = 13\) litri: **coerente** con l'incremento del 30%.

### ID 199

Quali possono essere le cause per le quali un motore diesel produce fumi di scarico di colore blu o bianco?

*Senza figura.*

**Risposta indicata (indice):** 0 — aria nel sistema carburante, comando di stop difettoso, avaria della pompa dell'olio.

**Scelte:**
0. aria nel sistema carburante, comando di stop difettoso, avaria della pompa dell'olio.
1. intasamento del filtro dell'olio, malfunzionamento della turbina di sovralimentazione.
2. intasamento del filtro dell'olio, carburatore intasato, malfunzionamento della turbina di sovralimentazione.

**Spiegazione (app):**

I fumi bianchi nel diesel si associano spesso a combustione incompleta, presenza di vapore/acqua o aria nel circuito di alimentazione; i fumi blu indicano in genere olio che brucia in camera (tenute, turbina, lubrificazione). Tra le combinazioni proposte, aria nel sistema carburante, anomalie al comando di stop e avaria della pompa dell'olio coprono cause tipiche di fumi chiari o bluastri; la terza opzione è fuori tema (carburatore assente nei diesel).

### ID 280

In base alla Tabella delle dotazioni di sicurezza minime da tenere a bordo (Allegato V al DM 146/2008), i fanali regolamentari di navigazione sono obbligatoriamente prescritti:

*Senza figura.*

**Risposta indicata (indice):** 1 — in navigazione notturna oltre 1 miglio dalla costa.

**Scelte:**
0. in navigazione notturna entro 1 miglio dalla costa.
1. in navigazione notturna oltre 1 miglio dalla costa.
2. comunque e sempre, a prescindere dal tipo di navigazione effettuata.

**Spiegazione (app):**

Secondo la tabella delle dotazioni minime (Allegato V al DM 146/2008), i fanali regolamentari rientrano tra le dotazioni prescritte per la navigazione notturna oltre la distanza dalla costa indicata in tabella per la classe di navigazione (per molte unità da diporto: oltre 1 miglio). Di notte, in navigazione, vanno utilizzati i fanali conformi al Regolamento COLREG per segnalare tipo di unità e aspetto; la tabella nazionale stabilisce quando devono essere in dotazione obbligatoria a bordo in funzione della zona autorizzata.

### ID 283

Quante boette fumogene deve mantenere a bordo un natante da diporto che naviga entro le 3 miglia nautiche dalla costa?

*Senza figura.*

**Risposta indicata (indice):** 2 — 1

**Scelte:**
0. 2
1. 3
2. 1

**Spiegazione (app):**

Per un natante da diporto in navigazione **entro 3 miglia** dalla costa, la tabella (Allegato V al DM 146/2008) prescrive **una boetta fumogena** arancione tra i segnali di soccorso. Per zone più lontane dalla costa il numero può aumentare (es. **due** boette oltre certe soglie): verificare sempre la propria autorizzazione di navigazione e l'allegato aggiornato.

### ID 288

Normalmente, qual è la portata in miglia dei fuochi a mano a luce rossa?

*Senza figura.*

**Risposta indicata (indice):** 1 — 6 miglia.

**Scelte:**
0. 7 miglia.
1. 6 miglia.
2. 5 miglia.

**Spiegazione (app):**

La portata dei fuochi a mano a luce rossa è normalmente di 5 miglia. Questo è dovuto alla loro capacità di emettere una luce intensa visibile su una lunga distanza, anche in condizioni di visibilità ridotta come nebbia e pioggia. Tuttavia, la distanza effettiva alla quale possono essere visti può variare a seconda delle condizioni atmosferiche e dell'osservatore. Saper stimare correttamente questa portata è fondamentale per le emergenze in mare, poiché consente ai soccorritori di localizzare efficacemente un'imbarcazione in difficoltà.

### ID 300

Normalmente, qual è all'incirca la portata diurna dei razzi a paracadute a luce rossa?

*Senza figura.*

**Risposta indicata (indice):** 2 — 5 miglia.

**Scelte:**
0. 9 miglia.
1. 7 miglia.
2. 5 miglia.

**Spiegazione (app):**

I razzi a paracadute a luce rossa sono dispositivi di segnalazione visiva utilizzati in situazioni di emergenza in ambito marittimo. La portata diurna di questi razzi dipende dalla loro altitudine massima e dalla luminosità del segnale rilasciato. I razzi a paracadute salgono a un'altezza considerevole prima di rilasciare il paracadute con la luce a caduta lenta, permettendo al segnale di essere visibile per un periodo più prolungato. In condizioni diurne, la visibilità del segnale può essere influenzata dall'illuminazione ambientale e dalle condizioni atmosferiche. Basandosi su performance standard e normative di sicurezza internazionale, la portata diurna stimata per questi razzi è generalmente intorno alle 5 miglia, offrendo un compromesso efficace tra altitudine raggiunta e luminosità del segnale nella luce del giorno.

### ID 316

I conduttori di tavole a vela, acquascooter e unità similari:

*Senza figura.*

**Risposta indicata (indice):** 0 — indossano permanentemente un mezzo di salvataggio individuale, comprese le persone trasportate, indipendentemente dalla
distanza dalla costa in cui la

**Scelte:**
0. indossano permanentemente un mezzo di salvataggio individuale, comprese le persone trasportate, indipendentemente dalla
distanza dalla costa in cui la
1. indossano permanentemente un mezzo di salvataggio individuale, indipendentemente dalla distanza dalla costa in cui la navigazione si svolge, a esclusione delle
persone trasportate.
2. indossano permanentemente un mezzo di salvataggio individuale, esclusivamente in navigazione entro le sei miglia nautiche dalla costa, incluse le persone
trasportate.

**Spiegazione (app):**

Per garantire la massima sicurezza in mare, è obbligatorio che i conduttori di tavole a vela, acquascooter e unità similari indossino sempre un mezzo di salvataggio individuale. Questo requisito è valido indipendentemente dalla distanza dalla costa in cui la navigazione si svolge. È un mezzo essenziale per prevenire incidenti e garantire una rapida risposta in situazioni di emergenza, quali cadute in acqua o malori improvvisi. Inoltre, l'obbligo si estende anche alle persone trasportate su tali unità, assicurando che ogni individuo a bordo sia protetto. Le norme che regolamentano queste attività mirano a ridurre il rischio di annegamento, migliorare la visibilità per i soccorsi e impedire incidenti dovuti a imprevisti, come correnti marine inattese o cambiamenti climatici improvvisi. Così, l'obbligo di indossare continuamente un mezzo di salvataggio è un principio fondamentale di sicurezza nei sport acquatici e nella navigazione ricreativa.

### ID 385

In caso di un grave infortunio occorso ad un membro dell'equipaggio durante la navigazione, quale Ente sarà opportuno contattare il prima possibile?

*Senza figura.*

**Risposta indicata (indice):** 1 — Centro Internazionale Radio Medico (CIRM).

**Scelte:**
0. guardia medica più vicina.
1. Centro Internazionale Radio Medico (CIRM).
2. Croce Rossa internazionale.

**Spiegazione (app):**

Il Centro Internazionale Radio Medico (CIRM) è l'ente appropriato da contattare in caso di un grave infortunio occorso a un membro dell'equipaggio durante la navigazione. Il CIRM offre assistenza medica via radio specificatamente per situazioni marittime, fornendo consulenza e supporto a bordo delle navi in tutto il mondo. Le navi, spesso lontane dalle strutture mediche terrestri e con limitate risorse mediche a bordo, necessitano di un servizio specializzato come quello del CIRM, che può fornire indicazioni immediate e specifiche per gestire l'emergenza fino a quando l'infortunato non può essere trasportato in una struttura sanitaria idonea. Al contrario, la guardia medica più vicina non ha la stessa specializzazione e capacità di risposta in un contesto marittimo, e la Croce Rossa internazionale opera principalmente su terra in situazioni di emergenza umanitaria, non avendo un servizio dedicato alla gestione delle emergenze mediche a bordo delle navi.

### ID 420

Ogni quanto tempo gli apparati ricetrasmittenti installati a bordo sono sottoposti ad ispezioni ordinarie?

*Senza figura.*

**Risposta indicata (indice):** 2 — sono esonerati dalle ispezioni ordinarie.

**Scelte:**
0. ogni 10 anni.
1. ogni 5 anni.
2. sono esonerati dalle ispezioni ordinarie.

**Spiegazione (app):**

Le apparecchiature ricetrasmittenti installate a bordo devono essere sottoposte a ispezioni ordinarie ogni 5 anni per garantire che siano conformi alle normative e che funzionino correttamente. Queste ispezioni regolari permettono di verificare lo stato di manutenzione dell'apparato, la corretta taratura delle frequenze, l'efficacia delle comunicazioni e la sicurezza complessiva delle operazioni marittime. Il mancato rispetto di tale scadenza potrebbe compromettere la sicurezza della navigazione poiché un apparato ricetrasmittente non funzionante correttamente potrebbe impedire la trasmissione di richieste di soccorso o la ricezione di avvisi importanti.

### ID 464

I concessionari delle strutture dedicate alla nautica da diporto devono riservare ormeggi in transito:

*Senza figura.*

**Risposta indicata (indice):** 2 — per la durata di 72 ore.

**Scelte:**
0. per la durata di 24 ore.
1. per la durata di 48 ore.
2. per la durata di 72 ore.

**Spiegazione (app):**

I concessionari delle strutture dedicate alla nautica da diporto sono tenuti a riservare ormeggi in transito per la durata di 24 ore. Questo è previsto per garantire un'equa fruizione degli spazi portuali e consentire a un maggior numero possibile di unità da diporto di accedere agli ormeggi disponibili. Gestire in questo modo la disponibilità di ormeggi aiuta a promuovere la rotazione delle imbarcazioni in transito, permettendo anche a chi è di passaggio di trovare un posto per sbarcare e sostare temporaneamente. La durata di 24 ore è considerata sufficiente per coprire le esigenze immediate degli utenti in transito, senza compromettere l'accessibilità per chi arriva successivamente. È importante comprendere che questa disposizione è in linea con la regolamentazione volta a favorire il turismo nautico e a ottimizzare l'uso delle risorse portuali, evitando occupazioni prolungate da parte delle stesse imbarcazioni e garantendo una gestione più efficiente e dinamica degli ormeggi.

### ID 488

Un natante con superficie velica non superiore a 4 metri quadrati può navigare:

*Senza figura.*

**Risposta indicata (indice):** 0 — entro 1 miglio dalla costa.

**Scelte:**
0. entro 1 miglio dalla costa.
1. entro 2 chilometri dalla costa.
2. entro mille metri dalla costa

**Spiegazione (app):**

La risposta corretta è "entro mille metri dalla costa". 

Nell'ambito della legislazione marittima italiana, i natanti con una superficie velica non superiore a 4 metri quadrati sono generalmente considerati mezzi molto piccoli e, di conseguenza, meno adatti a navigare in acque più aperte e potenzialmente pericolose. La normativa prevede specifiche restrizioni per questi natanti per garantire la sicurezza sia degli occupanti che della navigazione nelle acque costiere. Limitare la navigazione a entro mille metri dalla costa riduce i rischi associati a condizioni meteorologiche improvvise, forti correnti e incidenti lontano dal supporto immediato. Questa distanza permette di avere un accesso più rapido a terra in caso di emergenze, facilitando eventuali operazioni di soccorso.

### ID 583

Per assicurare l'unità ad un gavitello, ci si lega:

*Senza figura.*

**Risposta indicata (indice):** 0 — alla cima sotto il gavitello.

**Scelte:**
0. alla cima sotto il gavitello.
1. all'anello sulla sommità del gavitello.
2. come mi conviene indifferentemente, in quanto sono valide entrambe le soluzioni di cui alle risposte suddette.

**Spiegazione (app):**

Legarsi alla cima sotto il gavitello è la soluzione corretta perché questa cima è progettata specificamente per sopportare il carico dell'ormeggio. Il gavitello è generalmente costituito da un corpo galleggiante collegato al fondo mediante una catena e una cima, dove la catena è fissata con una boa. Quando ci si lega alla cima sotto il gavitello, si sfrutta il sistema di ancoraggio realizzato per resistere alle forze generati dalle correnti e dal vento che agiscono sull’imbarcazione.

Invece, l'anello sulla sommità del gavitello spesso non è progettato per sostenere il peso e le sollecitazioni continue di un'imbarcazione ancorata. Tale anello potrebbe essere presente solo per fini di maneggevolezza o per attaccarvi strumenti di segnalazione. Utilizzare questo anello potrebbe quindi portare a un ancoraggio meno sicuro, con il rischio di danneggiare le attrezzature o di perdere l'ormeggio dell’imbarcazione.

In sintesi, per garantire la sicurezza e la stabilità del collegamento all'ormeggio, è fondamentale utilizzare la cima sotto il gavitello, che è progettata appositamente per questo scopo.

### ID 586

Nella situazione di vento illustrata, qual è la manovra di approccio alla banchina più corretto?

*Senza figura.*

**Risposta indicata (indice):** 0 — immagine 1

**Scelte:**
0. immagine 1
1. immagine 2
2. immagine 3

**Spiegazione (app):**

Per un approccio alla banchina in presenza di vento, è essenziale considerare la direzione e l'intensità del vento in relazione alla manovra. Nell'immagine 1, l'approccio prevede l'entrata della prua nella direzione del vento, consentendo un controllo maggiore dell'imbarcazione e permettendo al timoniere di contrastare la deriva facilmente. Questa configurazione permette un eventuale aggiustamento della rotta con piccole correzioni. Inoltre, avvicinarsi al molo con il vento che spinge la prua verso il molo facilita l'attracco in sicurezza, minimizzando l'effetto di eventuali raffiche improvvise. Le altre immagini potrebbero mostrare situazioni in cui il vento spinge lateralmente o dalla poppa, complicando la manovra e aumentando il rischio di collisione con la banchina o di perdere il controllo dell'imbarcazione.

### ID 599

Il solcometro (comunemente detto anche log) misura la velocità:

*Senza figura.*

**Risposta indicata (indice):** 0 — propria o propulsiva, cioè quella prodotta dalle eliche.

**Scelte:**
0. propria o propulsiva, cioè quella prodotta dalle eliche.
1. rispetto alla superficie dell'acqua.
2. effettiva, cioè quella rispetto al fondo del mare.

**Spiegazione (app):**

Il solcometro, comunemente noto come log, misura la velocità rispetto alla superficie dell'acqua. Questa rilevazione è indipendente dai fattori esterni come le correnti marine e il vento, che possono influenzare la velocità effettiva rispetto alla terraferma o al fondo del mare. La velocità misurata dal solcometro è pertanto una misura diretta della velocità relativa della barca rispetto all'acqua che la circonda, ossia la velocità con cui la barca si "muove" attraverso il corpo d'acqua. Questo è cruciale per la navigazione perché permette di comprendere meglio l'efficacia della propulsione fornita dai motori e per effettuare stime accurate nelle manovre e nelle distanze percorse sull'acqua.

### ID 614

Quali unità da diporto al posto dei fanali regolamentari di navigazione possono utilizzare di notte una torcia bianca?

*Senza figura.*

**Risposta indicata (indice):** 2 — i natanti da diporto a vela di lunghezza inferiore a 7 metri.

**Scelte:**
0. le unità da diporto che navigano con velocità inferiore a 10 nodi.
1. i natanti da diporto a motore di lunghezza fuori tutto inferiore a
7.5 metri.
2. i natanti da diporto a vela di lunghezza inferiore a 7 metri.

**Spiegazione (app):**

I natanti da diporto a motore di lunghezza fuori tutto inferiore a 7,5 metri possono sostituire i fanali regolamentari di navigazione con una torcia bianca durante la notte. Questo è consentito in quanto le dimensioni ridotte e la conseguente minore velocità e manovrabilità di queste imbarcazioni rendono sufficiente un semplice segnale luminoso per essere visibili e identificabili dalle altre imbarcazioni. La torcia bianca serve a garantire che il natante sia riconoscibile in condizioni di scarsa visibilità, mantenendo comunque un livello adeguato di sicurezza in navigazione. Il regolamento specifica queste deroghe per garantire che anche le piccole imbarcazioni possano navigare in sicurezza senza la necessità di installare un sistema di fanali completo e più costoso, che potrebbe risultare sproporzionato rispetto alle loro dimensioni e utilizzo.

### ID 626

I fanali di navigazione sono prescritti per le unità da diporto?

*Senza figura.*

**Risposta indicata (indice):** 2 — si, per le unità da diporto in navigazione oltre 1 miglio dalla costa.

**Scelte:**
0. sì, per le unità da diporto in navigazione oltre 6 miglia dalla costa.
1. sì, per tutte le unità da diporto (natanti, imbarcazione e navi) indipendentemente dal tipo di navigazione effettuata.
2. si, per le unità da diporto in navigazione oltre 1 miglio dalla costa.

**Spiegazione (app):**

I fanali di navigazione sono prescritti per tutte le unità da diporto (natanti, imbarcazioni e navi) indipendentemente dal tipo di navigazione effettuata. Questo è stabilito dalle normative internazionali del COLREG (International Regulations for Preventing Collisions at Sea) e recepito anche dalle leggi nazionali che disciplinano la navigazione da diporto. I fanali di navigazione sono essenziali per garantire la visibilità dell'unità in condizioni di scarsa visibilità, di notte e per segnalare la direzione e il tipo di unità, prevenendo collisioni in mare. L'obbligo di avere questi dispositivi accesi è indipendente dalla distanza dalla costa, poiché il rischio di collisione esiste in ogni area di navigazione.

### ID 639

Il settore di visibilità dei fanali ripetitori (o facoltativi) rosso e verde che mostrano sull'albero alcune unità a vela è di:

*Senza figura.*

**Risposta indicata (indice):** 1 — è pari a 360 gradi.

**Scelte:**
0. è pari a 112,5 gradi.
1. è pari a 360 gradi.
2. è pari a 225 gradi.

**Spiegazione (app):**

I fanali ripetitori rosso e verde, comunemente usati su unità a vela, hanno una visibilità rispettivamente di 112,5 gradi ciascuno. Questo settore di visibilità permette di identificare la direzione della navigazione dell'imbarcazione durante le ore notturne o in condizioni di visibilità ridotta. Il fanale rosso è posizionato a sinistra (babordo) e il fanale verde a destra (tribordo). La combinazione di questi due fanali con un angolo di visuale di 112,5 gradi ciascuno copre dunque la prua della nave, permettendo di riconoscere immediatamente la direzione di avanzamento dell'imbarcazione. Questo è conforme alle normative internazionali sull'illuminazione per la navigazione e garantisce una navigazione sicura per evitare collisioni in mare.

### ID 642

I fanali rappresentati in figura a fianco indicano un'unità:

*Figura:* `/quiz-base-images/image_row_643.png`

**Risposta indicata (indice):** 1 — a motore di lunghezza inferiore a 50 metri che mostra la dritta.

**Scelte:**
0. a motore di lunghezza uguale o superiore a 50 metri che mostra la dritta.
1. a motore di lunghezza inferiore a 50 metri che mostra la dritta.
2. a vela che mostra la dritta.

**Spiegazione (app):**

Un'unità a motore di lunghezza uguale o superiore a 50 metri mostra, oltre ai fanali regolamentari, un secondo fanale a luce bianca sulla stessa linea verticale sopra il primo. I fanali mostrati nell'immagine indicano che l'unità è vista dal lato di dritta (destra), poiché si vedono sia il fanale di via verde sia il fanale di testa d'albero bianco. La presenza di due fanali di testa d'albero indica una lunghezza della nave uguale o superiore a 50 metri. Pertanto, l'unità è a motore e di lunghezza uguale o superiore a 50 metri, e sta mostrando la dritta.

### ID 653

Il segnale diurno rappresentato in figura a fianco indica:

*Figura:* `/quiz-base-images/image_row_654.png`

**Risposta indicata (indice):** 1 — una unità  alla fonda.

**Scelte:**
0. una unità incagliata.
1. una unità  alla fonda.
2. una unità che non governa.

**Spiegazione (app):**

Il segnale diurno rappresentato indica un'unità incagliata. Questo segnale è costituito da tre palloni neri disposti in verticale, uno sopra l'altro. Secondo il Regolamento Internazionale per Prevenire gli Abbordi in Mare (COLREG), le unità incagliate devono esporre di giorno questi tre segnali in modo da essere chiaramente visibili alle altre navi. Questi segnali servono a fornire informazioni vitali ai naviganti sulla condizione dell'unità in questione, in modo da evitare collisioni e garantire la sicurezza della navigazione. I segnali rimangono visibili anche durante eventuali operazioni di soccorso o di disincaglio.

### ID 654

Il segnale diurno rappresentato in figura a fianco indica:

*Senza figura.*

**Risposta indicata (indice):** 2 — un'unità a vela che naviga anche a motore.

**Scelte:**
0. una unità incagliata.
1. una unità alla fonda.
2. un'unità a vela che naviga anche a motore.

**Spiegazione (app):**

Il segnale diurno rappresentato è una "biconica nera" o anche detto "diamante nero" che identifica un'unità a vela che naviga anche a motore. 

Quando una barca a vela utilizza anche il motore come mezzo di propulsione, viene considerata un'unità a motore secondo il Regolamento Internazionale per Prevenire gli Abbordi in Mare (COLREGs). Questo segnale serve ad informare le altre imbarcazioni della duplice modalità di propulsione della barca.

La biconica nera è composta da due coni neri sovrapposti con le punte a contatto, una configurazione distinta e facilmente riconoscibile per evitare malintesi. È importante conoscere questo segnale anche per condurre manovre di sicurezza adeguate quando ci si avvicina a tali unità, che potrebbero avere capacità di manovra diverse rispetto ad un’unità a vela pura o ad un motoryacht.

### ID 658

Nella figura, di quale unità si tratta?

*Figura:* `/quiz-base-images/image_row_659.png`

**Risposta indicata (indice):** 0 — un'unità a vela in navigazione, di lunghezza pari o superiore a 20 metri, vista di prua.

**Scelte:**
0. un'unità a vela in navigazione, di lunghezza pari o superiore a 20 metri, vista di prua.
1. un'unità a motore in navigazione, di lunghezza pari o superiore a 50 metri, vista di prua.
2. un'unità a motore in navigazione, di lunghezza inferiore a 50 metri, vista di prua.

**Spiegazione (app):**

La figura mostra una barca con due luci di bordo (verde e rossa) e una luce di testa d'albero, posizionata al di sopra delle luci laterali. Questo schema di luci è tipico di un'unità a motore. La presenza di due luci di testa d'albero sovrapposte indica che si tratta di un'unità di lunghezza pari o superiore a 50 metri. Le luci di prua, verde a dritta e rossa a sinistra, confermano che l'unità è vista di prua. Pertanto, la risposta corretta è che si tratta di un'unità a motore in navigazione, di lunghezza pari o superiore a 50 metri, vista di prua.

### ID 662

I fanali rappresentati in figura a fianco indicano una nave:

*Figura:* `/quiz-base-images/image_row_663.png`

**Risposta indicata (indice):** 1 — da pesca, di lunghezza inferiore a 50 metri, che è intenta alla pesca non a strascico che dirige a dritta dell'osservatore.

**Scelte:**
0. da pesca di lunghezza uguale o superiore a 50 metri, che è intenta alla pesca a strascico, che dirige a sinistra dell'osservatore.
1. da pesca, di lunghezza inferiore a 50 metri, che è intenta alla pesca non a strascico che dirige a dritta dell'osservatore.
2. a motore, di lunghezza uguale o superiore a 50 metri, che sta dirigendo a sinistra dell'osservatore.

**Spiegazione (app):**

La corretta identificazione della nave dai fanali mostrati in figura si basa sulle regole stabilite dal sistema di fanali di navigazione. I fanali di navigazione sono luci specifiche che forniscono informazioni cruciali sul tipo e sull'attività della nave, oltre alla sua direzione rispetto all'osservatore.

Nel caso di una nave da pesca di lunghezza inferiore a 50 metri che è intenta alla pesca non a strascico, il codice dei fanali prescrive che la nave mostri le seguenti luci:
- Un fanale verde sopra un fanale bianco, visibili a 360 gradi. Questi fanali identificano la nave come impegnata nella pesca non a strascico.
- Un fanale rosso a sinistra (babordo) e un fanale verde a destra (dritta) che indicano la direzione della nave.

Le specifiche luci verdi e rosse laterali ci indicano la direzione verso cui è orientata la nave. In questo caso, se l'osservatore vede un fanale verde a destra, significa che la nave sta dirigendo a dritta dell'osservatore. Inoltre, l'assenza del secondo fanale bianco alto dietro (che richiede una lunghezza uguale o superiore a 50 metri e una motrice in direzione sinistra) conferma che la nave è inferiore a 50 metri. Pertanto, la descrizione corrisponde esattamente all'attività e alla direzione della nave rispetto all'osservatore, rendendo questa risposta corretta per i fanali rappresentati in figura.

### ID 688

In figura a fianco sono rappresentate due unità da diporto propulse a motore: quale delle due ha il dovere di manovrare?

*Senza figura.*

**Risposta indicata (indice):** 0 — l'unità A accosta a dritta e passa a poppa della B.

**Scelte:**
0. l'unità A accosta a dritta e passa a poppa della B.
1. l'unita B accosta a dritta e passa a poppa della A.
2. accostano a dritta entrambe.

**Spiegazione (app):**

Nel diritto della navigazione e secondo le normative internazionali stabilite dal Regolamento per Prevenire gli Abbordi in Mare (COLREG), tra due unità a motore che si trovano in rotta di collisione, l'unità che ha l'altra sul proprio lato di dritta ha il dovere di cedere il passo, agendo come unità predisposta alla manovra.

In questo caso, l'unità A ha l'unità B sul proprio lato di dritta. Pertanto, l'unità A ha il dovere di prendere misure necessarie per evitare la collisione. Accostare a destra è una manovra standard che consente a entrambe le unità uno spazio maggiore per passare in sicurezza. Passare a poppa della B è ulteriormente corretto, poiché consente di evitare la prua dell'unità che ha il diritto di precedenza. Perciò il comportamento più sicuro e regolamentato è che l'unità A accosta a dritta e passa a poppa della B, evitando così il rischio di collisione e rispettando la priorità di rotte.

Il concetto più complesso qui è interpretar bene le regole di precedenza e il concetto di manovra basato sul “dover evitare la collisione”. La regola 15 del COLREG chiarisce che quando due imbarcazioni a motore si avvicinano l'una all'altra con rotte di collisione, quella che vede l'altra sul proprio lato di dritta deve manovrare.

### ID 696

I fanali di navigazione sono prescritti per le unità da diporto?

*Senza figura.*

**Risposta indicata (indice):** 2 — si, per le unità da diporto in navigazione oltre 1 miglio dalla costa.

**Scelte:**
0. sì, per le unità da diporto in navigazione oltre 6 miglia dalla costa.
1. sì, per tutte le unità da diporto (natanti, imbarcazione e navi) indipendentemente dal tipo di navigazione effettuata.
2. si, per le unità da diporto in navigazione oltre 1 miglio dalla costa.

**Spiegazione (app):**

I fanali di navigazione sono prescritti per tutte le unità da diporto indipendentemente dal tipo di navigazione effettuata. Questo è perché i fanali di navigazione sono fondamentali per garantire la sicurezza in mare, rendendo visibili le imbarcazioni durante le ore notturne e in condizioni di scarsa visibilità. La normativa internazionale di riferimento, contenuta nel COLREG (International Regulations for Preventing Collisions at Sea), stabilisce che ogni unità da diporto deve essere equipaggiata con adeguati fanali di navigazione per segnalare la propria presenza e direzione in modo da evitare collisioni. Quindi, non importano le miglia dalla costa, tutte le imbarcazioni devono adempiere a questo obbligo.

### ID 737

Cosa indica la seguente sigla alfanumerica posta in prossimità del faro di Capo Negro dell'Isola di Zannone Fl(3) 10s 37m 12M?

*Senza figura.*

**Risposta indicata (indice):** 1 — che emette una luce lampeggiante a gruppi di 3 lampi ogni 10 secondi, la cui struttura ha un'altezza rispetto al livello medio del mare di 37 metri, ed è

**Scelte:**
0. che emette una luce lampeggiante a gruppi di 10 lampi ogni 3 secondi, la cui struttura ha un'altezza rispetto al livello medio del
1. che emette una luce lampeggiante a gruppi di 3 lampi ogni 10 secondi, la cui struttura ha un'altezza rispetto al livello medio del mare di 37 metri, ed è
2. che emette una luce fissa di 3 secondi, la cui struttura ha un'altezza rispetto al livello medio del mare di 10 metri, ed è visibile ad una portata nominale di 12 miglia nautiche.

**Spiegazione (app):**

La sigla alfanumerica "Fl(3) 10s 37m 12M" utilizza una convenzione internazionale per descrivere le caratteristiche dei fari marittimi. "Fl" indica che il faro emette una luce lampeggiante (Flashing). Il "(3)" specifica che i lampi sono emessi in gruppi di tre. Il "10s" significa che l'intero ciclo di tre lampi si ripete ogni 10 secondi. Il "37m" indica che l'altezza della luce, misurata dal livello medio del mare, è di 37 metri. Infine, "12M" specifica che la portata luminosa del faro è di 12 miglia nautiche. Pertanto, la risposta corretta è quella che riporta che il faro emette una luce lampeggiante a gruppi di 3 lampi ogni 10 secondi, la cui struttura ha un'altezza rispetto al livello medio del mare di 37 metri, ed è visibile ad una portata nominale di 12 miglia nautiche. Questa notazione è cruciale per i navigatori, poiché fornisce informazioni che permettono di identificare il faro e comprendere la sua visibilità, facilitando la navigazione sicura.

### ID 742

Di che colore è il corpo del segnale marittimo riportato sulla carta nautica e rappresentato in figura?

*Figura:* `/quiz-base-images/image_row_743.png`

**Risposta indicata (indice):** 1 — colore nero con banda(e) orizzontale rossa.

**Scelte:**
0. colore bianco con banda(e) orizzontale rossa.
1. colore nero con banda(e) orizzontale rossa.
2. colore rosso con banda(e) orizzontale nera.

**Spiegazione (app):**

Il segnale marittimo rappresentato nella figura ha il corpo di colore bianco con una o più bande orizzontali rosse. Questo tipo di segnalamento è comunemente utilizzato per indicare segnali speciali e viene conosciuto come "segnale laterale" del sistema IALA (Associazione Internazionale di Segnalamento Marittimo). Nel sistema IALA Region A, che copre la maggior parte del mondo incluso l'Europa e parte dell'Asia, i segnali laterali utilizzano specifici schemi di colore per indicare i lati dei canali di navigazione. Le boe e i segnali laterali di colore bianco con bande rosse indicano un'area pericolosa o speciale, come le zone di ancoraggio sicure, le aree di esercitazione o altre zone speciali non destinate alla navigazione normale.

### ID 744

Cosa indica il segnale marittimo rappresentato in figura?

*Figura:* `/quiz-base-images/image_row_745.png`

**Risposta indicata (indice):** 0 — una boa sferica luminosa.

**Scelte:**
0. una boa sferica luminosa.
1. una boa conica luminosa.
2. una boa cilindrica luminosa.

**Spiegazione (app):**

Il segnale marittimo rappresentato in figura indica una boa conica luminosa. I segnali marittimi hanno forme caratteristiche che permettono di identificarli facilmente. Tra queste, vi sono boe sferiche, cilindriche e coniche. 

Una boa conica si distingue per la sua forma a cono, con la punta rivolta verso l'alto. Questo tipo di segnalazione viene utilizzato per modalità specifiche di navigazione e delimitazione. Le boe luminose sono dotate di luci che le rendono visibili anche di notte o in condizioni di scarsa visibilità, garantendo una maggiore sicurezza nella navigazione.

Per distinguerla correttamente dagli altri tipi di boa, è essenziale riconoscere la sua forma e sapere che può essere luminosa. Queste boe sono spesso parte di un sistema più ampio di segnalazioni marittime, che include anche boe sferiche (a forma di sfera) e cilindriche (a forma di cilindro), con ciascuna che ha una funzione specifica nella navigazione e nella delimitazione delle acque.

### ID 752

Cosa indica la caratteristica del segnale marittimo rappresentato in figura?

*Senza figura.*

**Risposta indicata (indice):** 1 — un lampo ogni 3 secondi con portata nominale di 7 miglia nautiche.

**Scelte:**
0. 3 lampi ogni 3 secondi con visibilità di 7 miglia nautiche.
1. un lampo ogni 3 secondi con portata nominale di 7 miglia nautiche.
2. lampo ogni 7 secondi con portata geografica di 3 miglia nautiche.

**Spiegazione (app):**

I segnali marittimi sono dispositivi utilizzati per fornire informazioni cruciali ai naviganti, come la posizione di pericoli, la delimitazione di canali o l'entrata di porti. Questi segnali usano luci, colori, forme e suoni per comunicare con le navi. La particolare caratteristica di un segnale luminoso può includere la sequenza e la frequenza dei lampi, così come la portata visiva, che può essere definita come portata nominale o geografica.

La portata nominale si riferisce alla distanza massima alla quale una luce può essere vista in condizioni di visibilità standard (10 miglia nautiche di visibilità atmosferica). La portata geografica, invece, dipende dall'altezza della luce e dall'altezza dell'osservatore ed è solitamente limitata dalla curvatura della terra.

Analizzando le scelte, la risposta corretta è quella che descrive un lampo ogni 3 secondi con una portata nominale di 7 miglia nautiche. Questo perché la descrizione di un segnale marittimo di solito specifica la frequenza dei lampi (un lampo ogni 3 secondi) seguita dalla portata visibile (7 miglia nautiche, che in questo caso si riferisce alla portata nominale). Le altre opzioni non corrispondono alle convenzioni standard utilizzate nella descrizione delle caratteristiche dei segnali marittimi.

In conclusione, il segnale rappresentato indica un lampo ogni 3 secondi con una portata nominale di 7 miglia nautiche, specificando sia la frequenza dei lampi sia la massima distanza alla quale il segnale può essere avvistato in condizioni standard di visibilità.

### ID 758

In base al sistema di segnalamento marittimo IALA, quale dei due Sistemi prescritti è adottato nel Mar Mediterraneo?

*Figura:* `/quiz-base-images/image_row_759.png`

**Risposta indicata (indice):** 0 — il Sistema A (rosso a sx).

**Scelte:**
0. il Sistema A (rosso a sx).
1. il Sistema B (rosso a dx).
2. il Sistema C (bianco a dx e a sx).

**Spiegazione (app):**

Il sistema di segnalamento marittimo IALA (International Association of Marine Aids to Navigation and Lighthouse Authorities) è suddiviso in due regioni principali: il Sistema A e il Sistema B. Il Sistema A è adottato in Europa, Africa, Medio Oriente e gran parte dell'Asia, incluso il Mar Mediterraneo. Questo sistema prevede che le boe laterali rosse si trovino sul lato sinistro (sinistra) e le boe verdi sul lato destro (destra) quando si entra in porto o si segue la direzione convenzionale. Il motivo per cui il Mediterraneo adotta il Sistema A risale a decisioni storiche e alla necessità di uniformità nel segnalamento marittimo di queste regioni, garantendo sicurezza e chiarezza nella navigazione. Il Sistema B, contrario al Sistema A, è utilizzato principalmente nelle Americhe, in Corea e nelle Filippine, dove le boe rosse sono posizionate a destra e quelle verdi a sinistra. Non esiste un Sistema C nel segnalamento marittimo IALA.

### ID 759

Il segnale AISM - IALA regione A, in figura, è un segnale:

*Senza figura.*

**Risposta indicata (indice):** 2 — cardinale che indica di passare a Nord dello stesso perché il pericolo è a Sud.

**Scelte:**
0. cardinale che indica di passare a Ovest dello stesso perché il pericolo è ad Est.
1. cardinale che indica di passare a Est dello stesso perché il pericolo è ad Ovest.
2. cardinale che indica di passare a Nord dello stesso perché il pericolo è a Sud.

**Spiegazione (app):**

Il segnale AISM - IALA regione A in figura è un segnale cardinale nord che indica di passare a Nord dello stesso perché il pericolo è a Sud. Questo tipo di segnale nautico utilizza due coni neri puntati verso l'alto e una colorazione gialla sulla fascia inferiore e nera sulla fascia superiore. Questi segnali cardinali sono progettati per indicare ai naviganti la posizione sicura rispetto a un pericolo, fornendo istruzioni su quale direzione prendere per evitare l'ostacolo. Nella regione A, come in altre parti del mondo che seguono il sistema IALA, è essenziale riconoscere e comprendere questi segnali per navigare in sicurezza e prevenire incidenti marittimi.

### ID 799

Il miraglio del segnale cardinale Ovest è costituito da:

*Senza figura.*

**Risposta indicata (indice):** 2 — due coni sovrapposti uniti per i rispettivi vertici.

**Scelte:**
0. due coni sovrapposti uniti per le rispettive basi.
1. due coni sovrapposti con i rispettivi vertici rivolti verso il basso.
2. due coni sovrapposti uniti per i rispettivi vertici.

**Spiegazione (app):**

La risposta corretta è "due coni sovrapposti uniti per i rispettivi vertici". I segnali cardinali sono usati per indicare i pericoli navigazionali e sono fondamentali per la sicurezza in mare. Ciascuna delle quattro direzioni cardinali (Nord, Est, Sud, Ovest) è indicata da un miraglio conico specifico. 

Il segnale cardinale Ovest, in particolare, ha come miraglio due coni sovrapposti uniti per i rispettivi vertici, formando una sorta di "diamante". Questo è un codice visivo standardizzato che permette ai marinai di identificare il segnale a una distanza notevole e di reagire di conseguenza, evitando pericoli nascosti come secche o scogliere che si trovano esternamente alla delimitazione del segnale. 

Quest'identificazione visiva è essenziale per navigare in sicurezza, particolarmente in condizioni di scarsa visibilità o in acque congestionate. Comprendere e ricordare la forma dei miragli per ciascun segnale cardinale permette ai navigatori di prendere decisioni tempestive e informate, garantendo così la sicurezza della navigazione.

### ID 831

Cosa indica la sigla alfabetica posta sotto alla boa luminosa di fianco rappresentata?

*Senza figura.*

**Risposta indicata (indice):** 1 — che la struttura della boa luminosa, facente parte dei segnali cardinali del sistema AISM-IALA, ha una colorazione nera con banda gialla.

**Scelte:**
0. che la struttura della boa luminosa, facente parte dei segnali cardinali del sistema AISM-IALA, ha una colorazione nero-grigio-nero.
1. che la struttura della boa luminosa, facente parte dei segnali cardinali del sistema AISM-IALA, ha una colorazione nera con banda gialla.
2. che la luce della boa luminosa, facente parte dei segnali cardinali del sistema AISM-IALA, ha una colorazione gialla intermittente.

**Spiegazione (app):**

Il sistema AISM-IALA (Associazione Internazionale di Segnalamento Marittimo-International Association of Lighthouse Authorities) è utilizzato a livello globale per la segnalazione marittima. I segnali cardinali in questo sistema sono utilizzati per indicare ai naviganti la posizione sicura rispetto a un pericolo e sono identificati tramite colori specifici e caratteristiche luminose.

La sigla alfabetica sotto una boa luminosa rappresenta informazioni sulla luce della boa, in questo caso, la colorazione della luce della boa. Esistono diverse combinazioni di colori per le boe e diversi tipi di luci associate a queste. 

Nel caso di una luce di boa facente parte dei segnali cardinali del sistema AISM-IALA, una caratteristica di colorazione gialla intermittente è identificativa. La luce gialla è normalmente associata alla segnalazione di pericoli temporanei o pericoli nuovi non ancora catalogati nei sistemi di segnalazione permanenti. La funzione di questa colorazione è di avvertire i naviganti di osservare e procedere con precauzione nella zona indicata.

Pertanto, la sigla alfabetica che accompagna una boa luminosa indica il colore della luce utilizzata dalla stessa, in questo caso, rappresentando una luce di colore giallo intermittente come parte delle specifiche segnali cardinali.

### ID 841

Navigazione fluviale; procediamo controcorrente quando incrociamo una boa bianca:

*Senza figura.*

**Risposta indicata (indice):** 0 — si passa a sinistra del segnale.

**Scelte:**
0. si passa a sinistra del segnale.
1. la si evita passando a dritta o a sinistra indifferentemente.
2. si passa a dritta del segnale.

**Spiegazione (app):**

Nella navigazione fluviale, i segnali e le boe sono fondamentali per determinare la rotta corretta e prevenire collisioni o incagli. Quando si procede controcorrente, le boe bianche indicano ostacoli da evitare o delimitano aree specifiche del fiume. Il Codice della Navigazione Interna stabilisce che, durante la navigazione controcorrente, le boe bianche devono essere lasciate a sinistra dell'imbarcazione, cosicché il segnale rimanga a dritta. Questo è fatto per garantire una circolazione ordinata e prevedibile, minimizzando il rischio di incidenti e facilitando il passaggio sicuro delle imbarcazioni. Ignorare questo principio potrebbe mettere a rischio l'incolumità dell’imbarcazione e del suo equipaggio, oltre a causare potenziali danni ambientali o strutturali nel corso d'acqua.

### ID 898

Il Meteomar emesso alle ore 12:00 UTC di oggi:

*Senza figura.*

**Risposta indicata (indice):** 2 — è valido sino alle ore 00:00 UTC di domani.

**Scelte:**
0. è valido sino alle ore 18:00 UTC di oggi.
1. è valido sino alle ore 12:00 UTC di domani.
2. è valido sino alle ore 00:00 UTC di domani.

**Spiegazione (app):**

Il Meteomar è un bollettino meteo marino emesso quotidianamente con una validità tipica di 24 ore. Dato che il Meteomar in questione è emesso alle ore 12:00 UTC, la sua validità si estenderà fino alle ore 12:00 UTC del giorno successivo. Questa durata di validità permette ai naviganti di avere informazioni meteorologiche aggiornate per un intero giorno, consentendo una pianificazione dettagliata e sicura delle operazioni marittime. Quindi, è corretto affermare che un bollettino Meteomar emesso alle 12:00 UTC rimane valido fino alle 12:00 UTC del giorno successivo.

### ID 938

Il "fetch minimo" è:

*Senza figura.*

**Risposta indicata (indice):** 0 — il tratto di mare, privo di ostacoli, sul quale soffia un vento per un certo periodo, oltre il quale tratto di mare le onde raggiungeranno la
massima altezza per quel

**Scelte:**
0. il tratto di mare, privo di ostacoli, sul quale soffia un vento per un certo periodo, oltre il quale tratto di mare le onde raggiungeranno la
massima altezza per quel
1. una condizione del mare caratterizzata da onde corte e ripide.
2. un vento caldo e secco discendente da una catena montuosa.

**Spiegazione (app):**

Il "fetch minimo" è il tratto di mare, privo di ostacoli, sul quale soffia un vento per un certo periodo, oltre il quale tratto di mare le onde raggiungeranno la massima altezza per quell'intensità e direzione del vento. Questo concetto è fondamentale nella nautica poiché il "fetch" rappresenta la distanza di mare libera da ostacoli che consente al vento di trasferire energia all'acqua, generando onde. Maggiore è il fetch, più grande e alta sarà l'onda generata, fino a raggiungere una condizione di equilibrio dinamico in cui l'energia trasmessa non aumenta ulteriormente le dimensioni delle onde. Comprendere questo concetto è essenziale per i naviganti nel valutare la probabilità di incontrare mare mosso e nel pianificare rotte sicure.

### ID 954

L'altezza di un'onda è data dalla distanza verticale:

*Senza figura.*

**Risposta indicata (indice):** 0 — tra la cresta e l'incavo.

**Scelte:**
0. tra la cresta e l'incavo.
1. tra la cresta e il frangente.
2. tra il frangente e l'incavo.

**Spiegazione (app):**

L'altezza di un'onda è una misura fondamentale in meteorologia e oceanografia, determinata dalla distanza verticale tra il punto più alto (la cresta) e il punto più basso (l'incavo) di un'onda. Questo valore rappresenta l'ampiezza dell'onda, ovvero la differenza di livello tra la massima elevazione dell'onda e la sua depressione più profonda. Comprendere correttamente l'altezza delle onde è essenziale per garantire la sicurezza della navigazione e la prevenzione di incidenti marittimi. I termini "frangente" si riferiscono invece alla zona in cui un'onda solitamente si rompe, influenzata dalla profondità dell'acqua e dalla forma del fondale marino, e non è utilizzato nel calcolo diretto dell'altezza dell'onda. Pertanto, la risposta precisa è la distanza verticale tra la cresta e l'incavo.

### ID 956

Generalmente un'onda frange quando:

*Senza figura.*

**Risposta indicata (indice):** 2 — la profondità del fondale è minore del doppio dell'altezza dell'onda.

**Scelte:**
0. il rapporto tra altezza e lunghezza (ripidità) dell'onda è maggiore di 1/8.
1. la profondità del fondale è maggiore del doppio dell'altezza dell'onda.
2. la profondità del fondale è minore del doppio dell'altezza dell'onda.

**Spiegazione (app):**

Le onde frangono in genere quando la profondità del fondale è minore del doppio dell'altezza dell'onda. Questo avviene perché, man mano che l'onda si avvicina alla costa, l'interazione con il fondale marino cresce. Quando la profondità dell'acqua diventa sufficientemente bassa, l'onda viene influenzata dalle forze di resistenza e rallenta, facendo aumentare la sua altezza e diminuire la sua lunghezza d'onda. Questo fenomeno porta l'onda ad assumere una forma più ripida e instabile, culminando nella frangitura. La capacità dell'onda di sostenere la sua energia diminuisce con il ridursi della profondità, portando infine al collasso dell'onda stessa.

### ID 1061

Il simbolo rappresentato in figura indica:

*Figura:* `/quiz-base-images/image_row_1062.png`

**Risposta indicata (indice):** 1 — la presenza di uno schema di separazione del traffico, diviso da una zona di separazione.

**Scelte:**
0. la presenza e la direzione di correnti marine particolarmente intense, tra schemi di separazione del traffico.
1. la presenza di uno schema di separazione del traffico, diviso da una zona di separazione.
2. la presenza di una zona di traffico costiero senza limiti definiti.

**Spiegazione (app):**

Il simbolo rappresentato in figura indica la presenza e la direzione di correnti marine particolarmente intense, tra schemi di separazione del traffico. Gli schemi di separazione del traffico sono sistemi utilizzati per organizzare il flusso delle navi nei mari più trafficati, creando corsie separate per diverse direzioni di navigazione. Le correnti marine, rappresentate nel simbolo, influenzano la navigazione in queste aree, poiché possono deviare la rotta delle imbarcazioni e rendere la navigazione più impegnativa. È essenziale per i navigatori sapere dove si trovano queste correnti intense per pianificare adeguatamente la rotta, mantenere il controllo dell'imbarcazione e garantire la sicurezza della navigazione.

### ID 1074

Il GPS è obbligatorio?

*Senza figura.*

**Risposta indicata (indice):** 2 — nella navigazione oltre le 12 miglia.

**Scelte:**
0. nella navigazione oltre le 50 miglia.
1. no, è una dotazione consigliata e facoltativa.
2. nella navigazione oltre le 12 miglia.

**Spiegazione (app):**

Il GPS non è obbligatorio, è una dotazione consigliata e facoltativa. Questo perché, nell'ambito normativo che regolamenta le dotazioni di sicurezza a bordo delle imbarcazioni, il GPS è considerato uno strumento che agevola la navigazione e migliora la sicurezza, ma non rientra tra gli strumenti obbligatori richiesti per la navigazione sia costiera che d'altura. Le dotazioni obbligatorie includono generalmente strumenti come le dotazioni di salvataggio (giubbotti, zattere, razzi di segnalazione), le luci di navigazione e i dispositivi di segnalazione sonora e visiva, mentre il GPS, pur essendo altamente raccomandato per facilitare la determinazione della posizione e la pianificazione della rotta, rimane opzionale.

### ID 1181

Per misurare la distanza tra due punti sulla carta nautica in proiezione di mercatore si utilizza la scala:

*Senza figura.*

**Risposta indicata (indice):** 2 — delle latitudini, alla stessa latitudine della zona dove è stata misurata la distanza tra due punti.

**Scelte:**
0. delle longitudini, alla stessa longitudine della zona di mare dove è stata misurata la distanza tra due punti.
1. delle latitudini, alla stessa longitudine della zona dove è stata misurata la distanza tra due punti.
2. delle latitudini, alla stessa latitudine della zona dove è stata misurata la distanza tra due punti.

**Spiegazione (app):**

Per misurare le distanze tra due punti su una carta nautica in proiezione di Mercatore si utilizza la scala delle latitudini (la scala verticale), proprio perché la distanza tra le linee di latitudine è costante lungo tutto il meridiano e corrisponde sempre a chilometri nautici (1 minuto di latitudine = 1 miglio nautico). Questa costanza non si verifica per le longitudini, poiché la distanza tra i meridiani varia con la latitudine, diminuendo man mano che ci si avvicina ai poli. Pertanto, per ottenere una misura accurata, è essenziale usare la scala delle latitudini alla stessa latitudine della zona in cui si sta effettuando la misura.

### ID 1197

Una nave in navigazione a 15 nodi effettivi, in 18 minuti percorrerà:

*Senza figura.*

**Risposta indicata (indice):** 1 — 4,50 miglia.

**Scelte:**
0. 4,25 miglia.
1. 4,50 miglia.
2. 4,75 miglia.

**Spiegazione (app):**

Per determinare la distanza percorsa da una nave che naviga a 15 nodi in 18 minuti, è necessario applicare la formula fondamentale della navigazione che lega velocità, tempo e distanza. La velocità è data in nodi, che corrisponde a miglia nautiche per ora. 

Prima, convertiamo il tempo da minuti a ore. Poiché un'ora ha 60 minuti, 18 minuti equivalgono a 18/60 ore, cioè 0,3 ore.

La formula per calcolare la distanza (D) è: D = V * T, dove V è la velocità (15 nodi) e T è il tempo in ore (0,3 ore).

Quindi, la distanza percorsa è:
D = 15 nodi * 0,3 ore = 4,5 miglia nautiche.

Pertanto, la nave percorrerà 4,5 miglia nautiche in 18 minuti, rendendo corretta la seconda scelta.

### ID 1206

Avuto riguardo alla navigazione costiera, quale tra queste affermazioni è corretta?

*Senza figura.*

**Risposta indicata (indice):** 1 — la navigazione costiera costituisce un tipo di navigazione molto impegnativa, in quanto effettuata in prossimità della costa, ove sono presenti molto
spesso punti cospicui sconosciti,

**Scelte:**
0. la navigazione costiera costituisce un tipo di navigazione piuttosto facile considerato il suo sviluppo lungo la fascia costiera.
1. la navigazione costiera costituisce un tipo di navigazione molto impegnativa, in quanto effettuata in prossimità della costa, ove sono presenti molto
spesso punti cospicui sconosciti,
2. la navigazione costiera costituisce un tipo di navigazione molto facile in quanto agevolata dalla presenza di numerosissimi punti cospicui presenti lungo la fascia costiera.

**Spiegazione (app):**

La navigazione costiera è più complessa rispetto a quella d'altura perché si svolge in prossimità della terraferma dove sono numerosi i pericoli che devono essere evitati, come scogliere, secche e banchi di sabbia. Inoltre, in queste zone si trovano più frequentemente ostacoli e traffico marittimo che richiedono una maggiore attenzione. Nonostante la presenza di punti cospicui – elementi visibili e chiaramente riconoscibili dal mare utilizzati come riferimento per la navigazione –, la vicinanza alla terraferma richiede una manovrabilità più accurata e una maggiore precisione nella lettura delle carte nautiche e nell'uso degli strumenti di navigazione. Anche le condizioni del mare possono essere più variabili e difficili da prevedere in prossimità della costa, richiedendo dunque un'esperienza e una preparazione maggiore da parte del conduttore dell'imbarcazione.

### ID 1208

I punti cospicui osservati dal navigante per determinare il punto nave costiero devono risultare:

*Senza figura.*

**Risposta indicata (indice):** 1 — ben visibili e compresi entro un raggio visivo tra le otto e le dieci miglia nautiche dalla costa.

**Scelte:**
0. ben visibili e distanti dalla batimentica dei 50 metri di oltre sei miglia nautiche dalla costa.
1. ben visibili e compresi entro un raggio visivo tra le otto e le dieci miglia nautiche dalla costa.
2. ben visibili e compresi entro un raggio visivo tra i ventiquattro e i trentasei chilometri dalla costa.

**Spiegazione (app):**

Per determinare correttamente il punto nave costiero, è fondamentale utilizzare punti cospicui che risultino ben visibili e compresi entro un raggio visivo tra le otto e le dieci miglia nautiche dalla costa. Questa distanza è selezionata perché rientra in un intervallo ottimale per l'osservazione e per l'accuratezza della navigazione costiera. Se i punti cospicui fossero troppo vicini, potrebbero crearsi errori significativi dovuti alla parallasse o alle distorsioni prospettiche; se fossero troppo lontani, potrebbero risultare difficili da identificare e potrebbero introducarsi errori dovuti alla curvatura della Terra e alle distorsioni atmosferiche. Inoltre, questa distanza consente di avere un buon compromesso tra visibilità e precisione nella determinazione delle posizioni, garantendo una navigazione sicura e accurata lungo la costa.

### ID 1259

L’angolo di prora vera si legge:

*Senza figura.*

**Risposta indicata (indice):** 0 — sulla rosa dei venti delle carte nautiche.

**Scelte:**
0. sulla rosa dei venti delle carte nautiche.
1. non si può leggere, non conoscendo l’angolo di deriva e/o di scarroccio.
2. in corrispondenza della linea di fede della bussola.

**Spiegazione (app):**

L’angolo di prora vera si legge in corrispondenza della linea di fede della bussola. La prora vera (PV) è la direzione verso cui è orientata la prua dell'imbarcazione rispetto al nord vero. La linea di fede della bussola è una linea di riferimento che indica la direzione della prua dell'imbarcazione. Per determinare la prora vera, si utilizza la bussola, che mostra l'orientamento della prua in gradi rispetto al nord magnetico. Poi, applicando la declinazione magnetica (che rappresenta la differenza tra nord vero e nord magnetico in una data area geografica), otteniamo la PV. Anche se angolo di deriva e scarroccio influenzano la rotta dell'imbarcazione rispetto al fondo, essi non si leggono direttamente sulla bussola.

### ID 1289

Quando  il comandante di un'unità navale è tenuto a presentare la denuncia di evento straordinario all'Autorità Marittima?

*Senza figura.*

**Risposta indicata (indice):** 1 — entro tre giorni dall'arrivo in porto.

**Scelte:**
0. entro e non oltre il giorno successivo all'arrivo in porto.
1. entro tre giorni dall'arrivo in porto.
2. entro 24 ore dall'arrivo in porto.

**Spiegazione (app):**

Il comandante di un'unità navale è tenuto a presentare la denuncia di evento straordinario all'Autorità Marittima "entro 24 ore dall'arrivo in porto" per garantire tempestività nella segnalazione di eventi che potrebbero avere implicazioni di sicurezza, legali, ambientali o operative. Questo limite temporale è impostato per assicurare che le indagini possano iniziare il più rapidamente possibile, riducendo il rischio di perdita di informazioni rilevanti e facilitando la raccolta di prove fresche sul luogo e tra i testimoni. La prontezza nella denuncia permette un'azione immediata da parte delle autorità competenti, contribuendo così alla sicurezza della navigazione e alla protezione dell'ambiente marino.

### ID 1301

Un'imbarcazione da diporto può essere immatricolata presso:

*Senza figura.*

**Risposta indicata (indice):** 0 — l'Archivio telematico delle unità da diporto (ATCN).

**Scelte:**
0. l'Archivio telematico delle unità da diporto (ATCN).
1. gli uffici della Provincia.
2. gli uffici locali marittimi.

**Spiegazione (app):**

L'immatricolazione di un'imbarcazione da diporto deve essere effettuata presso l'Archivio telematico centrale delle unità da diporto (ATCN). Questo organismo centralizzato è stato istituito per semplificare e unificare le procedure di registrazione e documentazione delle imbarcazioni da diporto, raccogliendo in un database telematico tutte le informazioni rilevanti sulle unità immatricolate. Gli uffici locali marittimi e quelli della Provincia non hanno competenza diretta per l'immatricolazione, anche se possono fornire supporto o coordinare con l'ATCN per specifici aspetti burocratici. Il sistema telematico assicura un processo più efficiente e meno soggetto a errori, garantendo una gestione centralizzata delle informazioni e migliorando la tracciabilità e la regolamentazione delle unità da diporto.

### ID 1386

Tutte le unità a motore hanno l’obbligo di tenere a bordo la dichiarazione di
potenza del motore (o il certificato d’uso motore)?

*Senza figura.*

**Risposta indicata (indice):** 1 — no, oltre ai natanti da diporto, hanno l'obbligo solo le imbarcazioni da diporto dotate di motore fuoribordo.

**Scelte:**
0. si, tutte le unità da diporto a motore hanno l'obbligo a prescindere che siano o non siano iscritte nei registri navali.
1. no, oltre ai natanti da diporto, hanno l'obbligo solo le imbarcazioni da diporto dotate di motore fuoribordo.
2. no, hanno l'obbligo solo le navi da diporto.

**Spiegazione (app):**

Tutte le unità da diporto a motore, senza distinzione tra natanti e imbarcazioni, hanno l'obbligo di tenere a bordo la dichiarazione di potenza del motore (o il certificato d’uso motore). Questo documento specifica la potenza e le caratteristiche tecniche del motore installato e serve a garantire che il motore sia conforme alle norme di sicurezza e non superi determinati limiti di potenza imposti dalla legge. La dichiarazione di potenza o il certificato d’uso motore è essenziale per tutti i tipi di unità a motore perché permette alle autorità competenti di verificare che il mezzo sia idoneo a navigare in sicurezza e rispettare le regolamentazioni vigenti in tema di emissioni inquinanti e consumo di carburante.

### ID 1389

I limiti fissati dalla legge per il conseguimento della patente nautica relativamente al motore sono determinati:

*Senza figura.*

**Risposta indicata (indice):** 1 — dalla potenza massima di esercizio.

**Scelte:**
0. da una tabella ministeriale.
1. dalla potenza massima di esercizio.
2. dalla potenza fiscale del motore.

**Spiegazione (app):**

I limiti relativi al conseguimento della patente nautica riguardo ai motori sono determinati dalla potenza fiscale del motore. La potenza fiscale è un valore teorico, calcolato utilizzando una formula specifica che permette di standardizzare le caratteristiche dei motori a fini amministrativi e di normativa. Questo valore è utilizzato dalle autorità per identificare la categoria alla quale appartiene un determinato motore e decidere se è necessaria una patente specifica per pilotarlo. La potenza fiscale tiene conto di vari aspetti tecnici del motore, come la cilindrata e il numero di cilindri, e serve per armonizzare le leggi in merito alla sicurezza e alla conduzione delle imbarcazioni. In questo senso, quindi, non si fa riferimento alla potenza massima di esercizio, che è la potenza effettiva che il motore può generare, né a una tabella ministeriale, che potrebbe essere soggetta a modifiche e variazioni frequenti, il che renderebbe poco pratica una regolamentazione basata su di essa.

### ID 1394

La patente nautica è obbligatoria per il comando o condotta di un'imbarcazione da diporto entro 6 miglia dalla costa, quando a bordo sia installato un motore fuoribordo di potenza di 29 Kw e cilindrata di 1.299 centimetri cubici a iniezione diretta?

*Senza figura.*

**Risposta indicata (indice):** 2 — sì, in questo caso sussiste l'obbligo di patente nautica.

**Scelte:**
0. sì, solo se minorenne.
1. no, in questo caso è richiesto solo di aver compiuto i 18 anni di età.
2. sì, in questo caso sussiste l'obbligo di patente nautica.

**Spiegazione (app):**

La normativa italiana stabilisce che la patente nautica è obbligatoria per il comando o la condotta di unità da diporto con determinate caratteristiche tecniche del motore. In particolare, la legge richiede la patente nautica per motori fuoribordo con potenza superiore a 30 kW (40,8 CV) o cilindrata maggiore di 750 cc se a carburazione a due tempi, o 1.300 cc se a 4 tempi, oppure motori con cilindrata superiore a 2.000 cc se diesel.

Perciò, un motore fuoribordo con potenza di 29 kW e cilindrata di 1.299 cc a iniezione diretta non supera questi limiti né in potenza né in cilindrata massima per i motori a 4 tempi. La patente nautica non è quindi obbligatoria in questo caso specifico, purché il conducente abbia almeno 18 anni, come richiesto per la conduzione di imbarcazioni dotate di motore che non raggiungono i limiti sopra citati.

### ID 1426

L'unità con la quale viene praticato lo sci nautico:

*Senza figura.*

**Risposta indicata (indice):** 2 — può essere qualsiasi tipo di unità da diporto.

**Scelte:**
0. deve essere un'unità omologata CE.
1. deve essere un'unità immatricolata.
2. può essere qualsiasi tipo di unità da diporto.

**Spiegazione (app):**

Nello sci nautico, la sicurezza è di primaria importanza. Secondo il Codice della Navigazione e le norme di sicurezza in mare, le unità che trainano sciatori nautici devono essere immatricolate. Questo requisito garantisce che l'unità sia idonea e sicura per questo specifico utilizzo. L'immatricolazione implica che l'unità è stata sottoposta a una serie di controlli e verifiche tecniche che ne certificano l'affidabilità e la conformità alle normative vigenti, riducendo i rischi sia per gli sciatori sia per l'equipaggio. Conseguentemente, l'unità destinata allo sci nautico deve essere non solo omologata, ma anche immatricolata, per rispondere a standard rigorosi di sicurezza e idoneità operativa.

---

## Vela

*Domande segnalate (uniche, ordinate per id): **4***

### ID 23

Procedendo di poppa, la velocita avvertita dell'unità navale a vela sembra minore perché l'intensità del vento percepita risulta superiore rispetto a quella reale.

*Senza figura.*

**Risposta indicata:** Falso

**Spiegazione (app):**

La velocità avvertita di un'unità navale a vela che procede di poppa sembra minore perché l'intensità del vento apparente è inferiore a quella reale. Il vento apparente è la combinazione del vento reale con il vento generato dal movimento dell'imbarcazione. Quando si naviga di poppa, il vento reale spinge l'imbarcazione nella stessa direzione del moto, causando una riduzione della velocità del vento apparente. Questo dà l'impressione di una velocità di navigazione inferiore, sebbene la barca stia procedendo alla stessa o maggiore velocità rispetto ad altre andature.

### ID 183

L'avvolgifiocco è il moderno sistema che consente di ridurre la vela di prua senza ammainarla.

*Senza figura.*

**Risposta indicata:** Vero

**Spiegazione (app):**

L'avvolgifiocco è un meccanismo che consente di avvolgere o ridurre la vela di prua (spesso detta fiocco) attorno al proprio strallo, senza doverla ammainare completamente. Questo sistema è particolarmente utile quando le condizioni atmosferiche richiedono una riduzione della superficie velica per migliorare la manovrabilità della barca e garantirne la sicurezza. Il funzionamento dell'avvolgifiocco si basa su un tamburo avvolgitore posto alla base dello strallo o su un sistema integrato nel profilo del fiocco stesso. Utilizzando una cima dedicata, l'equipaggio può avvolgere parzialmente o completamente la vela intorno al cavo, consentendo una regolazione precisa della superficie esposta al vento. Questo sistema è ampiamente utilizzato nella navigazione moderna grazie alla sua praticità e alla capacità di ridurre lo sforzo fisico necessario per gestire le vele, soprattutto in condizioni di mare agitato o vento forte. Inoltre, l'avvolgifiocco può migliorare la velocità delle manovre, aumentando l'efficienza complessiva della navigazione.

### ID 204

I garrocci di cui è munito il fiocco vanno incocciati allo strallo partendo dal punto di penna e proseguendo verso il punto di scotta.

*Senza figura.*

**Risposta indicata:** Falso

**Spiegazione (app):**

I garrocci del fiocco devono essere incocciati allo strallo a partire dal punto di mura, proseguendo verso il punto di penna. Questo processo permette di mantenere la vela correttamente allineata e tesa lungo lo strallo, consentendo una migliore aerodinamicità e un funzionamento efficiente. Il punto di mura è quello in cui la base della vela è fissata alla barca, mentre la penna rappresenta l'estremità superiore della vela. Incocciare i garrocci in questo ordine assicura che la vela sia ben posizionata e stabile, evitando problemi come pieghe o piegamenti inappropriati che possono compromettere la navigazione. Inoltre, questa procedura facilita la manovra di issata del fiocco, riducendo il rischio di incastri o disallineamenti che potrebbero verificarsi issando i garrocci dal punto di penna verso il punto di scotta.

### ID 227

Per poggiare è necessario porre la barra al centro

*Senza figura.*

**Risposta indicata:** Falso

**Spiegazione (app):**

Poggiare significa far allontanare la prua dalla direzione del vento (andature più portanti). Con barra o ruota timone, si ottiene con una manovra attiva del timone, non lasciando la barra al centro in posizione neutra: al centro la deriva non induce il cambio di rotta voluto. L'affermazione della domanda è quindi falsa.

---

## Carteggio entro 12 miglia (5d)

*Domande segnalate (uniche, ordinate per id): **0***

---

## Carteggio oltre 12 miglia (42d)

*Domande segnalate (uniche, ordinate per id): **0***
