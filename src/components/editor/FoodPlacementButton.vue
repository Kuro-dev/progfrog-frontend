<script lang="ts" setup>
import {useEditorStore} from "@/stores/EditorStore";
import {useEditorApi} from "@/composables/EditorHelper";
import {Direction, TileType} from "@/api/generated";
import {computed, ref} from "vue";
import {useAssetStore} from "@/stores/AssetStore";
import {onKeyStroke} from "@vueuse/core";

const editor = useEditorStore()
const editorApi = useEditorApi()
const assets = useAssetStore()

const props = defineProps<{
  hotkey?: string
}>()

if (props.hotkey) {
  console.log("registering hotkey:", props.hotkey, "for food placement/removal")
  onKeyStroke(props.hotkey, (e) => {
    selectAsset()
  })
}

const asset = computed(() => assets.getEntity(editor.frog?.direction ?? Direction.North))

const amount = ref(1)

function clickListener() {
  if (lowerBounds(amount.value) !== true) {
    amount.value = 1
  }
  if (upperBounds(amount.value) !== true) {
    amount.value = 1
  }
  editorApi.setFood({
    position: editor.selectedTile,
    foodCount: amount.value
  })
}

function selectAsset() {
  editor.onEditorClick = clickListener
  editor.selectedType = TileType.None
}

function lowerBounds(val: number) {
  return val > 0 || 'Value must be greater than 0'
}

function upperBounds(val: number) {
  return val < 100 || 'Value must be smaller than 100'
}
</script>

<template>
  <v-col>
    <v-img :class="{'selected':editor.onEditorClick === clickListener}" :src="asset" class="clickable"
           @click="selectAsset">
      <v-tooltip activator="parent">
        {{ props.hotkey }}
      </v-tooltip>
    </v-img>
    <v-text-field v-if="editor.onEditorClick === clickListener" v-model="amount" :rules="[lowerBounds, upperBounds]"
                  label="Food amount" type="number"/>
  </v-col>
</template>

<style scoped>
.selected {
  border: blue solid thick;
}

.clickable {
  cursor: pointer;
}
</style>