<script lang="ts" setup>
import {RouterView} from 'vue-router'

</script>

<template>
  <v-app theme="light">
    <v-theme-provider theme="light">
      <v-app-bar>
        <v-tabs color="primary">
          <v-tab to="/editor">Editor</v-tab>
          <v-tab to="/game">Game</v-tab>
        </v-tabs>
      </v-app-bar>
      <v-container class="mt-10 pt-10">
        <RouterView/>
      </v-container>
    </v-theme-provider>
  </v-app>
</template>

<style scoped>
</style>
