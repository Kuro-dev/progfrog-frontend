<script lang="ts" setup>
import {useEditorStore} from "@/stores/EditorStore";
import {useEditorApi} from "@/composables/EditorHelper";
import {TileType} from "@/api/generated";
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
  onKeyStroke(props.hotkey, () => {
    selectAsset()
  })
}

const asset = computed(() => assets.getFood())

const amount = ref(1)

function clickListener() {
  if (lowerBounds(amount.value) !== true) {
    amount.value = 0
  }
  if (upperBounds(amount.value) !== true) {
    amount.value = 1
  }
  const maybeExistingItem = editor.foodPositions
      .filter(value => value.pos.y === editor.selectedTile.y &&
          value.pos.x === editor.selectedTile.x &&
          value.amount === amount.value).pop()
  if (maybeExistingItem) {
    return
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
  return val > -1 || 'Value must be positive'
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