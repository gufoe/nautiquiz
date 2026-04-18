<template>
  <q-page class="column q-pa-md" style="max-width: 520px; margin: 0 auto">
    <div class="text-caption text-grey-7 q-mb-sm">
      <q-btn flat dense no-caps icon="arrow_back" label="Home" :to="{ name: 'home' }" />
    </div>

    <div v-if="!sessionReady" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <template v-else-if="!isLoggedIn">
      <q-banner rounded class="bg-grey-3 text-grey-9">
        Accedi per gestire il profilo.
        <template #action>
          <q-btn flat color="primary" label="Accedi" no-caps @click="openAuthDialog" />
        </template>
      </q-banner>
    </template>

    <template v-else>
      <div class="text-h6 q-mb-md">Profilo</div>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-caption text-grey-7">Email</div>
          <div class="text-body1">{{ user?.email }}</div>
          <div class="text-caption text-grey-7 q-mt-sm">
            L’email non è visibile agli altri utenti.
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Nome utente</div>
          <q-input
            v-model="usernameDraft"
            outlined
            dense
            label="Nome utente"
            hint="3–24 caratteri: lettere minuscole, numeri, _"
            :disable="usernameLoading"
          />
          <q-btn
            class="q-mt-sm"
            unelevated
            color="primary"
            label="Salva nome"
            :loading="usernameLoading"
            :disable="!canSaveUsername"
            @click="saveUsername"
          />
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Cambia password</div>
          <q-input
            v-model="currentPassword"
            class="q-mb-sm"
            outlined
            dense
            type="password"
            label="Password attuale"
            autocomplete="current-password"
          />
          <q-input
            v-model="newPassword"
            class="q-mb-sm"
            outlined
            dense
            type="password"
            label="Nuova password"
            autocomplete="new-password"
            hint="Almeno 8 caratteri"
          />
          <q-input
            v-model="newPassword2"
            class="q-mb-sm"
            outlined
            dense
            type="password"
            label="Ripeti nuova password"
            autocomplete="new-password"
          />
          <q-btn
            unelevated
            color="primary"
            label="Aggiorna password"
            :loading="passwordLoading"
            :disable="!canSavePassword"
            @click="savePassword"
          />
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/composables/useAuth';

const USERNAME_RE = /^[a-z0-9_]{3,24}$/;

const $q = useQuasar();
const {
  sessionReady,
  isLoggedIn,
  user,
  openAuthDialog,
  setUsername,
  updatePassword,
} = useAuth();

const usernameDraft = ref('');
const usernameLoading = ref(false);
const currentPassword = ref('');
const newPassword = ref('');
const newPassword2 = ref('');
const passwordLoading = ref(false);

watch(
  user,
  (u) => {
    if (u?.username) usernameDraft.value = u.username;
  },
  { immediate: true },
);

const normalizedUsername = computed(() => usernameDraft.value.trim().toLowerCase());

const canSaveUsername = computed(
  () =>
    !usernameLoading.value &&
    USERNAME_RE.test(normalizedUsername.value) &&
    normalizedUsername.value !== (user.value?.username ?? ''),
);

async function saveUsername() {
  if (!canSaveUsername.value) return;
  usernameLoading.value = true;
  try {
    await setUsername(normalizedUsername.value);
  } catch (e: unknown) {
    $q.notify({
      type: 'negative',
      message: e instanceof Error ? e.message : 'Errore',
    });
  } finally {
    usernameLoading.value = false;
  }
}

const canSavePassword = computed(() => {
  if (passwordLoading.value) return false;
  if (newPassword.value.length < 8) return false;
  if (newPassword.value !== newPassword2.value) return false;
  return currentPassword.value.length > 0;
});

async function savePassword() {
  if (!canSavePassword.value) return;
  passwordLoading.value = true;
  try {
    await updatePassword(currentPassword.value, newPassword.value);
    currentPassword.value = '';
    newPassword.value = '';
    newPassword2.value = '';
  } catch (e: unknown) {
    $q.notify({
      type: 'negative',
      message: e instanceof Error ? e.message : 'Errore',
    });
  } finally {
    passwordLoading.value = false;
  }
}
</script>
