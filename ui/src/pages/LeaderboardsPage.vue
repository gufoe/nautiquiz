<template>
  <q-page class="column items-center q-pa-md" style="padding-top: 8px">
    <div class="text-caption text-grey-7 q-mb-sm self-stretch" style="max-width: 520px">
      <q-btn flat dense no-caps icon="arrow_back" label="Home" :to="{ name: 'home' }" />
    </div>

    <div v-if="!sessionReady" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <template v-else-if="!isLoggedIn">
      <q-banner rounded class="bg-grey-3 text-grey-9" style="max-width: 520px; width: 100%">
        Accedi per vedere le classifiche settimanali e globali.
        <template #action>
          <q-btn flat color="primary" label="Accedi" no-caps @click="openAuthDialog" />
        </template>
      </q-banner>
    </template>

    <template v-else>
      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="40px" />
      </div>
      <q-banner v-else-if="error" rounded class="bg-red-2 text-red-10" style="max-width: 520px">
        {{ error }}
      </q-banner>
      <LeaderboardView
        v-else
        :leaderboards="leaderboards"
        :session="null"
        :notice="null"
        :show-close-header="false"
        :show-footer-dismiss="false"
      />
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { ApiError } from 'src/api/client';
import { fetchLeaderboards, type LeaderboardsResponse } from 'src/api/leaderboards';
import LeaderboardView from 'src/components/LeaderboardView.vue';
import { useAuth } from 'src/composables/useAuth';

const emptyBoards = (): LeaderboardsResponse => ({
  weekly: { scope: 'weekly', weekStartsAt: null, rows: [] },
  global: { scope: 'global', weekStartsAt: null, rows: [] },
});

const { token, sessionReady, isLoggedIn, openAuthDialog } = useAuth();

const loading = ref(false);
const error = ref<string | null>(null);
const leaderboards = ref<LeaderboardsResponse>(emptyBoards());

async function load() {
  const t = token.value;
  if (!t) return;
  loading.value = true;
  error.value = null;
  try {
    leaderboards.value = await fetchLeaderboards(t);
  } catch (e) {
    const msg =
      e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Errore di rete';
    error.value = msg;
    leaderboards.value = emptyBoards();
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (sessionReady.value && isLoggedIn.value) void load();
});

watch(
  [sessionReady, isLoggedIn, token],
  ([ready, logged]) => {
    if (ready && logged) void load();
  },
);
</script>
