<script lang="ts" setup>

import {useEditorApi} from "@/composables/EditorHelper";
import MapRenderer from "@/components/MapRenderer.vue";
import {ref} from "vue";
import {useDebounceFn} from "@vueuse/core";
import AdvancedEditor from "@/components/AdvancedEditor.vue";
import * as buffer from "buffer";

const editor = useEditorApi()

const {loading, mapId, mapData} = editor


function createMap() {
  editor.createNew(newMapX.value || 10, newMapY.value || 10).then(map => bufferedMapData.value = map)
}

const advancedMode = ref(false)

const newMapX = ref(10)
const newMapY = ref(10)

const mapDimensionValid = ref(true)

function dimensionValid(dim?: number): true | string {
  return !!dim && dim > 0 || "Please enter a positive number above 0";
}



function tryUpdateMap() {

}
</script>

<template>
  <v-container>
    <v-responsive>
      <v-row>
        <v-col>
          <div>
            <p v-if="mapId">MapID: {{ mapId }}</p>
            <v-form v-model="mapDimensionValid">
              <v-row>
                <v-col lg="4" xl="3">
                  <v-text-field v-model="newMapX" :rules="[dimensionValid]" color="primary"
                                hide-spin-buttons label="Width" type="number"/>
                </v-col>
                <v-col lg="4" xl="3">
                  <v-text-field v-model="newMapY" :rules="[dimensionValid]" color="primary" hide-spin-buttons
                                label="Height" type="number"/>
                </v-col>
              </v-row>
            </v-form>
            <v-btn :disabled="!mapDimensionValid" color="primary" @click="createMap">Create new map</v-btn>
          </div>
          <div v-if="mapId" class="mt-3">
            <v-btn color="secondary" @click="advancedMode = !advancedMode">Toggle Advanced mode</v-btn>
            <AdvancedEditor v-model="mapData" :disabled="!advancedMode"></AdvancedEditor>
          </div>
        </v-col>
        <v-col>
          <MapRenderer :map-string="mapData"/>
        </v-col>
      </v-row>
    </v-responsive>

  </v-container>
</template>

<style scoped>

</style>