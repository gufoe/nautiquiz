<template>
  <q-dialog v-model="open" @hide="reset">
    <q-card style="min-width: 320px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ isRegister ? 'Registrati' : 'Accedi' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary">
        <q-tab name="login" label="Accedi" />
        <q-tab name="register" label="Registrati" />
      </q-tabs>

      <q-card-section>
        <q-input
          v-model="email"
          type="email"
          label="Email"
          outlined
          dense
          autocomplete="email"
          class="q-mb-md"
        />
        <q-input
          v-if="isRegister"
          v-model="username"
          label="Nome utente"
          outlined
          dense
          autocomplete="username"
          class="q-mb-md"
          hint="3–24 caratteri: lettere minuscole, numeri, _ (visibile in classifica)"
          @keyup.enter="submit"
        />
        <q-input
          v-model="password"
          type="password"
          label="Password"
          outlined
          dense
          autocomplete="current-password"
          hint="Minimo 8 caratteri (solo per nuovi account)"
          @keyup.enter="submit"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Annulla" color="grey" v-close-popup />
        <q-btn
          unelevated
          :label="isRegister ? 'Crea account' : 'Entra'"
          color="primary"
          :loading="loading"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/composables/useAuth';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>();

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const tab = ref<'login' | 'register'>('login');
const email = ref('');
const username = ref('');
const password = ref('');
const loading = ref(false);

/** Matches API: lowercase a-z, digits, underscore, length 3–24. */
const USERNAME_RE = /^[a-z0-9_]{3,24}$/;

const $q = useQuasar();
const { register, login } = useAuth();

const isRegister = computed(() => tab.value === 'register');

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      tab.value = 'login';
      resetFields();
    }
  },
);

function resetFields() {
  email.value = '';
  username.value = '';
  password.value = '';
}

function reset() {
  resetFields();
}

async function submit() {
  const em = email.value.trim().toLowerCase();
  const pw = password.value;
  const un = username.value.trim().toLowerCase();
  if (!em || !pw) return;
  if (isRegister.value) {
    if (pw.length < 8) {
      $q.notify({ type: 'warning', message: 'La password deve avere almeno 8 caratteri' });
      return;
    }
    if (!USERNAME_RE.test(un)) {
      $q.notify({
        type: 'warning',
        message: 'Nome utente: 3–24 caratteri (lettere minuscole, numeri, _ )',
      });
      return;
    }
  }
  loading.value = true;
  try {
    if (isRegister.value) await register(em, pw, un);
    else await login(em, pw);
    open.value = false;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Errore';
    $q.notify({ type: 'negative', message: msg });
  } finally {
    loading.value = false;
  }
}
</script>
