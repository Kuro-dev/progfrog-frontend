<script lang="ts" setup>

import MapRenderer from "@/components/render/MapRenderer.vue";
import {ref} from "vue";
import {useEditorStore} from "@/stores/EditorStore";
const editorStore = useEditorStore()


const mapString = ref(`
XXXXXXX
XXXXXXX
000000X
XXXXX0X
XXXXX0X
XXXXX0X
XXXXX5X
XXXXXXX
XXXXXXX
`)
</script>

<template>
  <v-container>
    <v-btn v-if="editorStore.mapID" @click="loadMap">Load map from editor</v-btn>
    <v-row>
      <v-col>
        <v-textarea label="Editor"/>
      </v-col>
      <v-col>
        <MapRenderer :map-string="mapString"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>