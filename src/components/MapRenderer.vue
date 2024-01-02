<script lang="ts" setup>
import {computed, onMounted, ref, toRef, watch} from 'vue';
import {computedEager} from "@vueuse/core";
import {useGlobalStore} from "@/stores/GlobalStore";

interface MapDrawerProps {
  mapString: string;
  wallTexture?: string;
  floorTexture?: string;
  voidTexture?: string;
}

const props = withDefaults(defineProps<MapDrawerProps>(), {
  wallTexture: () => "/assets/game/wall-texture.jpg",
  floorTexture: () => "/assets/game/floor-texture.jpg",
  voidTexture: () => "/assets/game/void-texture.jpg",
});


const store = useGlobalStore()
const tileSize = toRef(store, "computedTileSize")
const canvas = ref<HTMLCanvasElement | null>(null);
const bufferCanvas = ref<HTMLCanvasElement | null>(null);
const map = computedEager(() => props.mapString.trim())
const width = computed(() => Math.max(...map.value.split('\n').map(val => val.length)) * tileSize.value);
const height = computed(() => map.value.split('\n').length * tileSize.value);

watch(() => props, () => drawMap(), {deep: true})
watch(() => tileSize, () => drawMap())

function drawBufferedImage() {
  const visibleCtx = canvas.value?.getContext('2d');
  if (visibleCtx && bufferCanvas.value) {
    visibleCtx.drawImage(bufferCanvas.value, 0, 0);
  }
}

function getTexture(char: string) {
  switch (char) {
    case "X" :
      return props.wallTexture;
    case "0" :
      return props.floorTexture
    case "#" :
      return props.voidTexture
  }
  throw new Error("Unknown character: " + char)
}

function drawMap() {
  if (!bufferCanvas.value || !props.mapString) return;

  const ctx: CanvasRenderingContext2D | null = bufferCanvas.value.getContext('2d');
  if (!ctx) return;

  const mapLines = props.mapString.trim().split('\n');
  const calls: Promise<void>[] = []
  mapLines.forEach((column, y) => {
    const yPos = y * tileSize.value;
    Array.from(column).forEach((char, x) => {
      const img = new Image();
      calls.push(new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, x * tileSize.value, yPos, tileSize.value, tileSize.value);
          resolve()
        }
        img.onerror = reject;
      }))

      img.src = getTexture(char)
    });
  });
  Promise.all(calls).then(() => {
    drawBufferedImage()
  })
}

onMounted(drawMap);
</script>
<template>
  <div>
    <canvas ref="canvas" :height="height" :width="width" class="position-relative"></canvas>
    <canvas v-show="false" ref="bufferCanvas" :height="height" :width="width" class="position-absolute"></canvas>
  </div>
</template>
