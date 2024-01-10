<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from 'vue';
import {type Coordinate, type FrogDTO} from "@/api/generated";
import {getTileType} from "@/composables/EditorHelper";
import {computedEager, useMouseInElement} from "@vueuse/core";
import {useAssetStore} from "@/stores/AssetStore";

interface MapDrawerProps {
  mapString: string;
  showDebugInfo?: boolean
  showHoverTile?: boolean
  selectedTile?: Coordinate,
  frog?: FrogDTO,
}

const emit = defineEmits<{
  (e: "update:selectedTile", val: Coordinate): void
  (e: "click"): void
  (e: "contextmenu", val: MouseEvent): void
}>()
const assets = useAssetStore();
const props = defineProps<MapDrawerProps>();


const canvas = ref<HTMLCanvasElement | null>(null);
const bufferCanvas = ref<HTMLCanvasElement | null>(null);
const width = computedEager(() => window.innerWidth * .5);
const height = computedEager(() => window.innerHeight);


function computeTileSizeX() {
  return width.value / Math.max(...props.mapString.trim().split('\n').map(val => val.length));
}

function computeTileSizeY() {
  return height.value / props.mapString.trim().split('\n').length;
}

const observer = useMouseInElement(canvas)

const hoveredTile = reactive<Coordinate>({x: 0, y: 0})

watch(() => {
  return {x: observer.elementX.value, y: observer.elementY.value}
}, value => {
  if (!props.showHoverTile) return;

  if (!observer.isOutside.value) {
    const x = Math.floor(value.x / computeTileSizeX())
    const y = Math.floor(value.y / computeTileSizeY())
    if (x !== hoveredTile.x || y !== hoveredTile.y) {
      hoveredTile.x = x;
      hoveredTile.y = y;
      emit("update:selectedTile", hoveredTile)
      drawMap()
    }
  }
})

watch(() => props, () => drawMap(), {deep: true})

function drawBufferedImage() {
  const visibleCtx = canvas.value?.getContext('2d');
  if (visibleCtx && bufferCanvas.value) {
    visibleCtx.clearRect(0, 0, visibleCtx.canvas.width, visibleCtx.canvas.height);
    visibleCtx.drawImage(bufferCanvas.value, 0, 0);
  }
}

watch(width, () => drawMap())
watch(height, () => drawMap())

function drawMap() {
  if (!bufferCanvas.value || !props.mapString) return;
  const ctx: CanvasRenderingContext2D | null = bufferCanvas.value.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const tileSizeX = computeTileSizeX()
  const tileSizeY = computeTileSizeY()
  const mapLines = props.mapString.trim().split('\n');
  const calls: Promise<any>[] = []
  mapLines.forEach((column, y) => {
    const yPos = y * tileSizeY;
    Array.from(column).forEach((char, x) => {
      const img = assets.getAssetImage(getTileType(char))
      img.then((data) => ctx.drawImage(data, x * tileSizeX, yPos, tileSizeX, tileSizeY))
      calls.push(img)
    });
  })
  Promise.all(calls).then(() => {
    if (props.showHoverTile) {
      ctx.strokeRect(hoveredTile.x * tileSizeX, hoveredTile.y * tileSizeY, tileSizeX, tileSizeY)
    }
    drawFrog(tileSizeX, tileSizeY)
    drawBufferedImage()
  })
}

watch(() => props.frog, () => drawFrog())

onMounted(() => {
  setTimeout(drawMap, 50)
});

function handleContextMenuEvent(event: MouseEvent) {
  event.preventDefault()
  emit('contextmenu', event)
}

const imagePosition: Coordinate = reactive({x: 0, y: 0})

function drawFrog(tileSizeX: number = computeTileSizeX(), tileSizeY: number = computeTileSizeY()) {
  if (props.frog && canvas.value) {
    const left = canvas.value.offsetLeft
    imagePosition.x = Math.floor(left + (props.frog.position.x * tileSizeX))
    imagePosition.y = Math.floor((props.frog.position.y * tileSizeY))
  }
}

const frogTexture = computed(() => {
  if (props.frog) {
    return assets.getEntity(props.frog.direction)
  }
  return undefined
})
</script>
<template>
  <div>
    <canvas ref="canvas"
            :class="{'editable':showHoverTile}"
            :height="height"
            :width="width"
            class="position-relative"
            @click="$emit('click')"
            @contextmenu="handleContextMenuEvent"/>

    <canvas v-show="false"
            ref="bufferCanvas"
            :height="height"
            :width="width"
            class="position-absolute"/>
    <v-img v-show="frog" ref="frogView" :height="computeTileSizeY()" :src="frogTexture"
           :style="{ top: `${imagePosition.y}px`, left: `${imagePosition.x}px` }"
           :width="computeTileSizeX()"
           alt="frog-gif" class="position-absolute no-mouse-interaction"/>

    <div v-if="showDebugInfo" class="bottomRight">
      <div>Tile: {{ hoveredTile.x }} x {{ hoveredTile.y }}</div>
      <div>Frog: {{ imagePosition }}</div>
    </div>
  </div>
</template>
<style>
.bottomRight {
  top: 10px;
  right: 10px;
  position: fixed;
  background-color: rgba(128, 128, 128, 0.7);
  color: white;
}

.editable {
  cursor: url("/assets/cursor/pencil.png") 0 32, auto;
}

.no-mouse-interaction {
  pointer-events: none;
}
</style>
