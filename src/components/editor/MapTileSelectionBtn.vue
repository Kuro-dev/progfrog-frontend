<script lang="ts" setup>
import {useEditorStore} from "@/stores/EditorStore";
import {computed} from "vue";
import {useAssetStore} from "@/stores/AssetStore";
import {TileType} from "@/api/generated";
import {onKeyStroke} from "@vueuse/core";

const assets = useAssetStore();
const store = useEditorStore();

const props = defineProps<{
  type: TileType,
  hotkey?: string
}>()
const asset = computed(() => assets.getAsset(props.type))

if (props.hotkey) {
  console.log("registering hotkey:", props.hotkey, "for tile type:", props.type)
  onKeyStroke(props.hotkey, (e) => {
    selectAsset()
  })
}

function selectAsset() {
  store.selectedType = props.type
  store.onEditorClick = undefined
}
</script>

<template>
  <v-col>
    <v-img :class="{'selected':store.selectedType === type}" :src="asset" class="clickable"
           @click="selectAsset">
      <v-tooltip activator="parent">
        {{ props.hotkey }}
      </v-tooltip>
    </v-img>
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