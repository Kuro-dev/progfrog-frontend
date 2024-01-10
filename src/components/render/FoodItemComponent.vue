<script lang="ts" setup>
import type {Coordinate} from "@/api/generated";
import {onMounted, reactive, watch} from "vue";
import {useAssetStore} from "@/stores/AssetStore";

const props = defineProps<{
  position: Coordinate,
  amount: number,
  tileSizeX(): number,
  tileSizeY(): number,
  offsetLeft?: number,
}>()

const imagePosition: Coordinate = reactive({x: 0, y: 0})
const assets = useAssetStore()

watch(() => props.offsetLeft, () => positionFood())
watch(() => props.amount, () => positionFood())

function positionFood(tileSizeX: number = props.tileSizeX(), tileSizeY: number = props.tileSizeY()) {
  const left = props.offsetLeft ?? 0
  imagePosition.x = Math.floor(left + (props.position.x * tileSizeX))
  imagePosition.y = Math.floor((props.position.y * tileSizeY))
}

onMounted(() => positionFood())
console.log("Created food")
</script>

<template>

  <div :style="{ top: `${imagePosition.y}px`, left: `${imagePosition.x}px` }"
       class="position-absolute no-mouse-interaction">
    <v-img ref="frogView"
           :height="props.tileSizeY()"
           :src="assets.getFood()"
           :width="props.tileSizeX()"
           alt="frog-gif"
           />
  </div>

</template>

<style scoped>

</style>