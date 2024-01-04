<script lang="ts" setup>


import {ref, watch} from "vue";
import {useDebounceFn} from "@vueuse/core";
import type {MapEditorDrawRequest} from "@/api/generated";

const props = defineProps<{
  mapData: string,
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: "drawData", data: MapEditorDrawRequest[])
}>()

const bufferedMapData = ref("");
const editorInput = ref<HTMLTextAreaElement | null>(null)

watch(() => props.mapData, (val) => bufferedMapData.value = val, {immediate: true})

function handleKeyUp(e: KeyboardEvent) {
  let position = editorInput.value?.selectionStart ? editorInput.value.selectionStart - 1 : 0;
  let y = 0;
  let x = 0;
  bufferedMapData.value.split("\n").forEach(row => {
    if (row.length < position) {
      position -= row.length;
      y++;
    } else {
      x = row.length - position
    }
  });
  console.log("added ", e.key, "to position ", x, "x", y)
}

const fn = useDebounceFn(() => {
  const data: string = mapData.value
}, 300)

</script>

<template>
  <v-textarea ref="editorInput" v-model="bufferedMapData" :auto-grow="true" :disabled="disabled"
              class="text-mono" label="Mapdata" @keyup="handleKeyUp" @update:model-value="tryUpdateMap"/>
</template>

<style scoped>

</style>