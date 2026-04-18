<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal :class="headerClass">
      <q-toolbar>
        <q-btn flat :to="{ name: 'home' }" round dense size="sm" icon="show_chart" />
        <q-toolbar-title>Nautiquiz</q-toolbar-title>
        <q-btn
          v-if="!isLoggedIn"
          flat
          round
          dense
          size="sm"
          icon="account_circle"
          aria-label="Accedi"
          @click="showAuthDialog = true"
        />
        <q-btn
          v-else
          flat
          dense
          no-caps
          size="sm"
          class="ellipsis"
          style="max-width: 140px"
          :label="userEmail"
        >
          <q-menu anchor="bottom right" self="top right">
            <q-list dense style="min-width: 160px">
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>Esci</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <!-- Theme toggle -->
        <q-btn
          :class="btnClass"
          flat
          round
          dense
          size="sm"
          :icon="icon"
          :aria-pressed="isDark"
          @click="toggle"
          aria-label="Toggle theme"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <AuthDialog v-model="showAuthDialog" />
    <ImportLocalDialog />
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTheme } from 'src/composables/useTheme';
import { useAuth } from 'src/composables/useAuth';
import AuthDialog from 'src/components/AuthDialog.vue';
import ImportLocalDialog from 'src/components/ImportLocalDialog.vue';

const showAuthDialog = ref(false);
const { isDark, toggle, icon, btnClass } = useTheme();
const { isLoggedIn, user, logout } = useAuth();

const userEmail = computed(() => user.value?.email ?? '');

const headerClass = computed(() =>
  isDark.value
    ? 'bg-grey-9 text-white'
    : 'bg-grey-2 text-grey-9 shadow-1',
);
</script>
