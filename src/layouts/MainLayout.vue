<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal :class="'bg-blue'">
      <q-toolbar>
        <q-btn flat :to="{ name: 'home' }" round dense icon="home" />
        <q-toolbar-title>SOS Patente Nautica</q-toolbar-title>
        <!-- <q-btn
          flat
          @click="drawerRight = !drawerRight"
          round
          dense
          icon="menu"
        /> -->
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>
