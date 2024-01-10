<script lang="ts" setup>
import {RouterView} from 'vue-router'

</script>

<template>
  <v-app theme="light">
    <v-theme-provider theme="light">
      <v-app-bar style="width: 30%;" absolute>
        <v-tabs color="primary">
          <v-tab to="/editor">Editor</v-tab>
          <v-tab to="/game">Game</v-tab>
        </v-tabs>
      </v-app-bar>
      <v-container>
        <RouterView/>
      </v-container>
    </v-theme-provider>
  </v-app>
</template>

<style scoped>
</style>
