import {useGameStore} from "@/stores/GameStore";
import {GameControllerApi} from "@/api/generated";

const api = new GameControllerApi()

export function useGameApi() {
    const store = useGameStore()


}