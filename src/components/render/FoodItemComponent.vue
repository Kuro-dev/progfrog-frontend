<script lang="ts" setup>
import type {Coordinate} from "@/api/generated";
import {onMounted, reactive, ref, watch} from "vue";
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

const image = ref<string>()

watch(() => props.offsetLeft, () => positionFood())
watch(() => props.amount, () => drawFood())

function positionFood(tileSizeX: number = props.tileSizeX(), tileSizeY: number = props.tileSizeY()) {
  const left = props.offsetLeft ?? 0
  imagePosition.x = Math.floor(left + (props.position.x * tileSizeX))
  imagePosition.y = Math.floor((props.position.y * tileSizeY))
}

const canvas = document.createElement('canvas');

function drawFood() {
  const ctx = canvas.getContext('2d');
  assets.getFoodImage().then(img => {
    const amount = Math.min(props.amount, 20);
    if (amount === 1) {
      image.value = img.src
      return;
    }
    if (!ctx) return;
    const tileSizeX = props.tileSizeX();
    const tileSizeY = props.tileSizeY();
    ctx.canvas.width = tileSizeX
    ctx.canvas.height = tileSizeY

    // Calculate the number of rows and columns
    const cols = Math.ceil(Math.sqrt(amount));
    const rows = Math.ceil(amount / cols);

    // Calculate spacing
    const spacingX = Math.floor(tileSizeX / cols);
    const spacingY = Math.floor(tileSizeY / rows);

    // Draw images
    for (let i = 0; i < amount; i++) {
      // Calculate position for each image
      const row = Math.floor(i / cols);
      const col = i % cols;

      // Calculate scale factor to maintain aspect ratio
      const scaleFactor = Math.min(spacingX / img.width, spacingY / img.height);
      const scaledWidth = img.width * scaleFactor;
      const scaledHeight = img.height * scaleFactor;

      // Calculate position to center the image
      const posX = col * spacingX + (spacingX - scaledWidth) / 2;
      const posY = row * spacingY + (spacingY - scaledHeight) / 2;

      // Draw image at calculated position with scaled size
      ctx.drawImage(img, posX, posY, scaledWidth, scaledHeight);
    }

    image.value = canvas.toDataURL();
  })
}

onMounted(() => {
  setTimeout(()=>{
    drawFood()
    positionFood()
  })
})
</script>

<template>
  <div :style="{ top: `${imagePosition.y}px`, left: `${imagePosition.x}px` }"
       class="position-absolute no-mouse-interaction">
    <v-img ref="frogView"
           :height="props.tileSizeY()"
           :src="image"
           :width="props.tileSizeX()"
           alt="food-item"/>
  </div>
</template>

<style scoped>

</style>