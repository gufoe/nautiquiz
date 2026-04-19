<template>
  <q-dialog v-model="showImportDialog" persistent>
    <q-card style="min-width: 320px">
      <q-card-section>
        <div class="text-h6">Importare i progressi da questo browser?</div>
        <div class="text-body2 text-grey-7 q-mt-sm">
          Dopo l’accesso, se troviamo risposte salvate in locale ti chiediamo se inviarle al server.
          Così il tuo account e le classifiche riflettono lo stesso storico. Puoi anche posticipare:
          in quel caso continui con i dati in questo dispositivo finché non importi.
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Non ora" color="grey" @click="dismissImportPrompt" />
        <q-btn unelevated label="Importa" color="primary" @click="confirmImportLocalData" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  showImportDialog,
  confirmImportLocalData,
  dismissImportPrompt,
} from 'src/auth/state';
</script>
