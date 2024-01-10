import {
    type Coordinate,
    type FrogDTO,
    MapEditorControllerApi,
    type MapEditorDrawRequest,
    type MapEditorFoodRequest,
    type  MapEditorResponse,
    TileType
} from "@/api/generated";
import {onMounted, toRef} from "vue";
import {useEditorStore} from "@/stores/EditorStore";
import router from "@/router";

const api = new MapEditorControllerApi();

export function getTileIdentifier(type: TileType): string {
    switch (type) {
        case TileType.Wall:
            return 'X'
        case TileType.Floor:
            return "0"
        case TileType.Void:
            return "#"
        case TileType.None:
            return '^'
    }
}

export function getTileType(type: string | null): TileType | null {
    switch (type) {
        case "X":
            return TileType.Wall
        case "0":
            return TileType.Floor
        case "#":
            return TileType.Void
        case '^':
            return TileType.None
    }
    return null;
}


export function useEditorApi() {
    const store = useEditorStore()

    const mapId = toRef(store, "mapID")

    onMounted(() => {
        const id = router.currentRoute.value.query.id
        if (id && typeof id === 'string') {
            loadMap(id)
        }
    })

    const mapData = toRef(store, "mapData")
    const loading = toRef(store, "loading")

    async function setState(state: MapEditorResponse) {
        mapData.value = state.map
        store.frog = state.frog
        mapId.value = state.mapID
        await router.replace({query: undefined})
        await router.push({query: {id: mapId.value}})

    }

    function loadMap(id: string) {
        if (mapId.value === id) {
            return
        }
        loading.value = true
        api.loadMap(id)
            .then(response => setState(response.data))
            .catch(() => createNew())
            .finally(() => loading.value = false)
    }

    async function createNew(width: number = 10, height: number = 10) {
        loading.value = true;
        try {
            let value = await api.createEmptyMap(width, height);
            setState(value.data)
            return mapData.value
        } finally {
            loading.value = false;
        }

    }

    function draw(pos: Coordinate, tile: TileType) {
        return drawMultiple([{pos: pos, type: tile}])
    }

    function drawMultiple(req: MapEditorDrawRequest[]): Promise<string> {
        return new Promise((resolve, reject) => {
            if (mapId.value) {
                api.draw(mapId.value, req)
                    .then(value => {
                        mapData.value = value.data.map
                        resolve(mapData.value)
                    })
                    .finally(() => loading.value = false)
            } else {
                reject("Must create a map first");
            }
        })
    }

    function setMap(newMap: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (mapId.value) {
                loading.value = true
                api.setMap(mapId.value, newMap)
                    .then(value => {
                        mapData.value = value.data.map
                        resolve(mapData.value)
                    })
                    .finally(() => loading.value = false)
            } else {
                reject("Must create a map first");
            }
        })
    }

    function setFrog(frog: FrogDTO) {
        loading.value = true
        return api.setFrog(mapId.value, frog)
            .then((response) => setState(response.data))
            .finally(() => loading.value = false)
    }

    function setFood(req: MapEditorFoodRequest) {
        loading.value = true
        return api.setFood(mapId.value, req)
            .then((response) => setState(response.data))
            .finally(() => loading.value = false)
    }

    return {
        //data
        loading,
        mapData,
        mapId,
        //functions
        createNew,
        draw,
        setFood,
        drawMultiple,
        setMap,
        setFrog,
    }
}
