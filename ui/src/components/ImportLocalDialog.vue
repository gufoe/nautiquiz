<template>
  <q-dialog v-model="showImportDialog" persistent>
    <q-card style="min-width: 320px">
      <q-card-section>
        <div class="text-h6">Importare i dati da questo dispositivo?</div>
        <div class="text-body2 text-grey-7 q-mt-sm">
          Hai già progressi salvati nel browser. Vuoi copiarli sul tuo account così restano
          sincronizzati con il server?
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
