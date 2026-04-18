<template>
  <q-dialog :model-value="true" persistent>
    <q-card style="min-width: 320px; max-width: 420px">
      <q-card-section>
        <div class="text-h6">Scegli il tuo nome utente</div>
        <p class="text-body2 text-grey-8 q-mb-md">
          È il nome mostrato in classifica. Solo lettere minuscole, numeri e underscore, tra 3 e 24 caratteri
          (viene salvato in minuscolo).
        </p>
        <q-input
          v-model="username"
          label="Nome utente"
          outlined
          dense
          autocomplete="username"
          :disable="loading"
          hint="Solo a-z, 0-9 e _ (viene salvato in minuscolo)"
          @keyup.enter="submit"
        />
      </q-card-section>
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          unelevated
          color="primary"
          label="Salva"
          :loading="loading"
          :disable="!canSubmit"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/composables/useAuth';

/** Must match API normalization: lowercase a-z, digits, underscore, 3–24 chars. */
const USERNAME_RE = /^[a-z0-9_]{3,24}$/;

const username = ref('');
const loading = ref(false);
const $q = useQuasar();
const { setUsername } = useAuth();

const normalized = computed(() => username.value.trim().toLowerCase());

const canSubmit = computed(
  () => USERNAME_RE.test(normalized.value) && !loading.value,
);

async function submit() {
  if (!canSubmit.value) return;
  loading.value = true;
  try {
    await setUsername(normalized.value);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    $q.notify({ type: 'negative', message: msg });
  } finally {
    loading.value = false;
  }
}
</script>
