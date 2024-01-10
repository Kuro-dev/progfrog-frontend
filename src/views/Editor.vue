<script lang="ts" setup>

import {useEditorApi} from "@/composables/EditorHelper";
import MapRenderer from "@/components/MapRenderer.vue";
import {reactive, ref, toValue} from "vue";
import MapEditor from "@/components/editor/MapEditor.vue";
import {useEditorStore} from "@/stores/EditorStore";
import {type Coordinate, TileType} from "@/api/generated";
import {useAssetStore} from "@/stores/AssetStore";
import MapSelectionMenuItem from "@/components/contextmenu/MapSelectionMenuItem.vue";
import FrogSelectionmenuItem from "@/components/contextmenu/FrogSelectionmenuItem.vue";

const editor = useEditorApi()

const {loading, mapId, mapData} = editor
const assetStore = useAssetStore();

function createMap() {
  editor.createNew(newMapX.value || 10, newMapY.value || 10)
}


const newMapX = ref(10)
const newMapY = ref(10)

const mapDimensionValid = ref(true)

function dimensionValid(dim?: number): true | string {
  return !!dim && dim > 0 || "Please enter a positive number above 0";
}


const store = useEditorStore()
const api = useEditorApi()

function tryEditorInteraction() {
  const listener = toValue(store.onEditorClick)
  if (listener) {
    listener()
  } else {
    if (!store.selectedType || store.selectedType === TileType.None) {
      return;
    }
    if (store.selectedTile) {
      api.draw(store.selectedTile, store.selectedType)
    }
  }
}

const showContextMenu = ref(false);
const menuPosition = reactive<Coordinate>({x: 0, y: 0})

function showCustomContextMenu(event: MouseEvent) {
  menuPosition.x = event.x
  menuPosition.y = event.y
  showContextMenu.value = true;
}


</script>

<template>
  <v-container>
    <v-responsive>
      <v-row>
        <v-col class="mt-10">
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

            <MapEditor></MapEditor>
          </div>
        </v-col>
        <v-col>
          <MapRenderer v-if="mapData" v-model:selected-tile="store.selectedTile" :frog="store.frog"
                       :map-string="mapData" show-debug-info
                       show-hover-tile @click="tryEditorInteraction" @contextmenu="showCustomContextMenu"/>
        </v-col>
      </v-row>
      <v-menu v-model="showContextMenu"
              :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }"
              location-strategy="connected"
              target="cursor"
              @contextmenu.prevent>
        <v-list @contextmenu.prevent>
          <MapSelectionMenuItem :type="TileType.Floor"/>
          <MapSelectionMenuItem :type="TileType.Wall"/>
          <MapSelectionMenuItem :type="TileType.Void"/>
          <FrogSelectionmenuItem/>
        </v-list>
      </v-menu>
    </v-responsive>

  </v-container>
</template>

<style scoped>

</style>