<script setup lang="ts">
import {useEditorStore} from "@/stores/EditorStore";
import {useEditorApi} from "@/composables/EditorHelper";
import {useAssetStore} from "@/stores/AssetStore";
import {computed} from "vue";
import {Direction, TileType} from "@/api/generated";

const editor = useEditorStore()
const editorApi = useEditorApi()
const assets = useAssetStore()

const asset = computed(() => assets.getEntity(editor.frog?.direction ?? Direction.North))

function rotateDirection(dir: Direction): Direction {
  switch (dir) {
    case Direction.North:
      return Direction.East
    case Direction.South:
      return Direction.West
    case Direction.East:
      return Direction.South
    case Direction.West:
      return Direction.North
  }
}

function clickListener() {
  if (editor.frog?.position.x === editor.selectedTile.x && editor.frog.position.y === editor.selectedTile.y) {
    editor.frog.direction = rotateDirection(editor.frog.direction)
  }
  editorApi.setFrog({
    direction: editor.frog?.direction ?? Direction.North,
    position: editor.selectedTile
  })
}

function selectAsset() {
  editor.onEditorClick = clickListener
  editor.selectedType = TileType.None
}
</script>

<template>
  <v-list-item :disabled="editor.selectedType === TileType.None" density="compact" @click.prevent="selectAsset">
    <template #prepend>
      <v-img :src="asset" width="24px"></v-img>
    </template>
    <div class="ml-2">
      Frog
    </div>
  </v-list-item>
</template>

<style scoped>

</style>