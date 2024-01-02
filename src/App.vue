<script lang="ts" setup>
import {RouterView} from 'vue-router'
import {useGlobalStore} from "@/stores/GlobalStore";

const store = useGlobalStore()
</script>

<template>
  <v-app theme="light">
    <v-theme-provider theme="light">
      <v-app-bar>
        <v-tabs color="primary">
          <v-tab to="/editor">Editor</v-tab>
          <v-tab to="/game">Game</v-tab>
        </v-tabs>
        <v-col class="mt-4" lg="2" sm="3" xl="1">
          <v-text-field v-model="store.tileSize" color="primary" density="compact" hide-spin-buttons
                        label="Tile size in px"
                        type="number"/>
        </v-col>
      </v-app-bar>
      <v-container class="mt-10 pt-10">
        <RouterView/>
      </v-container>
    </v-theme-provider>
  </v-app>
</template>

<style scoped>
</style>
