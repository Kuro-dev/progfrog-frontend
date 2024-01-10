<script lang="ts" setup>
import {useEditorStore} from "@/stores/EditorStore";
import {useEditorApi} from "@/composables/EditorHelper";
import {Direction, TileType} from "@/api/generated";
import {computed} from "vue";
import {useAssetStore} from "@/stores/AssetStore";
import {onKeyStroke} from "@vueuse/core";

const editor = useEditorStore()
const editorApi = useEditorApi()
const assets = useAssetStore()

const props = defineProps<{
  hotkey?: string
}>()

if (props.hotkey) {
  console.log("registering hotkey:", props.hotkey, "for frog placement")
  onKeyStroke(props.hotkey, (e) => {
    selectAsset()
  })
}

const asset = computed(() => assets.getEntity(editor.frog?.direction ?? Direction.South))

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
  if (editor.frog && editor.frog?.position.x === editor.selectedTile.x && editor.frog.position.y === editor.selectedTile.y) {
    editor.frog.direction = rotateDirection(editor.frog.direction)
  }
  editorApi.setFrog({
    direction: editor.frog?.direction ?? Direction.South,
    position: editor.selectedTile
  })
}

function selectAsset() {
  editor.onEditorClick = clickListener
  editor.selectedType = TileType.None
}
</script>

<template>
  <v-col>
    <v-img :class="{'selected':editor.onEditorClick === clickListener}" :src="asset" class="clickable"
           @click="selectAsset">
      <v-tooltip  v-if="hotkey" activator="parent">
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