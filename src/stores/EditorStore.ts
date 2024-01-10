import {defineStore} from "pinia";
import {ref} from "vue";
import {type Coordinate, type FoodItemDTO, type FrogDTO, TileType} from "@/api/generated";


export const useEditorStore = defineStore('editorStore', () => {

    const mapID = ref<string>('')

    const mapData = ref<string>('')
    const loading = ref(false)

    const selectedTile = ref<Coordinate>({x: 0, y: 0})
    const selectedType = ref<TileType>(TileType.Wall)

    const frog = ref<FrogDTO>()
    const foodPositions = ref<FoodItemDTO[]>([])

    const onEditorClick = ref<Function>()
    return {
        mapID,
        mapData,
        loading,
        onEditorClick,
        selectedTile,
        selectedType,
        frog,
        foodPositions
    }
})
