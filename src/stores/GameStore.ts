import {defineStore} from "pinia";
import {ref} from "vue";

export const useGameStore = defineStore('game-data-store', () => {
    const loading = ref(false)
    return {
        loading,
    }
})