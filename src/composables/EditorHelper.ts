import {MapEditorControllerApi, type MapEditorDrawRequest, TileType} from "@/api/generated";
import {ref} from "vue";

const api = new MapEditorControllerApi();

export function useEditorApi() {
    const mapId = ref<string>("")
    const mapData = ref("")
    const loading = ref(false)

    function createNew(width: number = 10, height: number = 10) {
        loading.value = true;
        return api.createEmptyMap(width, height)
            .then(value => {
                mapId.value = value.data.mapID;
                mapData.value = value.data.map
                return mapData.value
            })
            .finally(() => loading.value = false)

    }

    function draw(x: number, y: number, tile: TileType) {
        return drawMultiple([{pos: {x, y}, type: tile}])
    }

    function drawMultiple(req: MapEditorDrawRequest[]): Promise<string> {
        return new Promise((resolve, reject) => {
            if (mapId.value) {
                api.draw(mapId.value, req)
                    .then(value => {
                        mapId.value = value.data.mapID;
                        mapData.value = value.data.map
                        resolve(mapData.value)
                    })
                    .finally(() => loading.value = false)
            }
            reject("Must create a map first");
        })

    }

    return {
        //data
        loading,
        mapData,
        mapId,
        //functions
        createNew,
        draw,
        drawMultiple
    }

}