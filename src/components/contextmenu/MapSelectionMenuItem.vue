<script lang="ts" setup>
import type {TileType} from "@/api/generated";
import {useAssetStore} from "@/stores/AssetStore";
import {useEditorStore} from "@/stores/EditorStore";

const props = defineProps<{
  type: TileType
}>()

const assetStore = useAssetStore();
const editorStore = useEditorStore()

function changeTile() {
  editorStore.selectedType = props.type;
  editorStore.onEditorClick = undefined
}
</script>

<template>
  <v-list-item :disabled="editorStore.selectedType === type" density="compact" @click.prevent="changeTile(type)">
    <template #prepend>
      <v-img :src="assetStore.getAsset(type)" width="24px"></v-img>
    </template>
    <div class="ml-2">
      {{ type }}
    </div>
  </v-list-item>
</template>

<style scoped>

</style>