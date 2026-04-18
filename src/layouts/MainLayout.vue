<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal :class="headerClass">
      <q-toolbar>
        <q-btn flat :to="{ name: 'home' }" round dense size="sm" icon="show_chart" />
        <q-toolbar-title>Nautiquiz</q-toolbar-title>
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
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'src/composables/useTheme';

const { isDark, toggle, icon, btnClass } = useTheme();

const headerClass = computed(() =>
  isDark.value
    ? 'bg-grey-9 text-white'
    : 'bg-grey-2 text-grey-9 shadow-1',
);
</script>
