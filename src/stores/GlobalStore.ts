import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useGlobalStore = defineStore("Globalstore", () => {
    const tileSize = ref(80);
    const computedTileSize = computed(() => Number(tileSize.value) <= 10 ? 10 : Number(tileSize.value))

    return {
        //data
        tileSize,
        //computed
        computedTileSize,
    }
})