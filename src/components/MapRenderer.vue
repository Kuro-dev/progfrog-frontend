<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue';
import {TileType} from "@/api/generated";

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


const canvas = ref<HTMLCanvasElement | null>(null);
const bufferCanvas = ref<HTMLCanvasElement | null>(null);
const width = computed(() => window.innerWidth * .5);
const height = computed(() => window.innerHeight);

watch(() => props, () => drawMap(), {deep: true})

function drawBufferedImage() {
  const visibleCtx = canvas.value?.getContext('2d');
  if (visibleCtx && bufferCanvas.value) {
    visibleCtx.drawImage(bufferCanvas.value, 0, 0);
  }
}

function getTexture(char: string) {
  switch (char) {
    case TileType.WALL :
      return props.wallTexture;
    case TileType.FLOOR :
      return props.floorTexture
    case TileType.VOID :
      return props.voidTexture
  }
  throw new Error("Unknown character: " + char)
}

watch(width, () => drawMap())
watch(height, () => drawMap())

function drawMap() {
  if (!bufferCanvas.value || !props.mapString) return;
  const map = props.mapString.trim()
  const tileSizeX: number = width.value / Math.max(...map.split('\n').map(val => val.length));
  const tileSizeY: number = height.value / map.split('\n').length;
  const ctx: CanvasRenderingContext2D | null = bufferCanvas.value.getContext('2d');
  if (!ctx) return;

  const mapLines = props.mapString.trim().split('\n');
  const calls: Promise<void>[] = []
  mapLines.forEach((column, y) => {
    const yPos = y * tileSizeY;
    Array.from(column).forEach((char, x) => {
      const img = new Image();
      calls.push(new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, x * tileSizeX, yPos, tileSizeX, tileSizeY);
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
