import {defineStore} from "pinia";
import {type Coordinate, Direction, TileType} from "@/api/generated";

export const useAssetStore = defineStore('game-store', () => {
    const wallTexture = "/assets/game/wall-texture.jpg"
    const floorTexture = "/assets/game/floor-texture.jpg"
    const voidTexture = "/assets/game/void-texture.jpg"
    const notFoundTexture = "/assets/game/missingTexture.png"
    const images: { [key: string]: HTMLImageElement } = {}

    function getAsset(type?: TileType | null): string {
        switch (type) {
            case TileType.Floor:
                return floorTexture
            case TileType.Wall:
                return wallTexture
            case TileType.Void:
                return voidTexture
        }
        return notFoundTexture
    }

    function getAssetImage(type?: TileType | null): Promise<HTMLImageElement> {
        let texture: string = notFoundTexture;
        switch (type) {
            case TileType.Floor:
                texture = floorTexture
                break;
            case TileType.Wall:
                texture = wallTexture
                break;
            case TileType.Void:
                texture = voidTexture
                break;
        }
        if (images[texture]) {
            return Promise.resolve(images[texture])
        }
        const img = new Image()
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
            img.onload = () => {
                resolve(img)
            }
            img.onerror = reject;
        })
        img.src = texture;
        images[texture] = img;
        return promise;
    }

    function getEntity(dir: Direction) {
        return `/assets/game/entity/frog/${dir.toLowerCase()}.gif`
    }

    function getEntityImage(dir: Direction) {
        if (images[dir]) {
            return Promise.resolve(images[dir])
        }
        const img = new Image()
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
            img.onload = () => {
                resolve(img)
            }
            img.onerror = reject;
        })
        img.src = getEntity(dir);
        images[dir] = img;
        return promise;
    }

    const cookiePath = "/assets/game/entity/cookie.png"
    function getFood(){
        return cookiePath
    }

    function getFoodImage() {
        if (images[cookiePath]) {
            return Promise.resolve(images[cookiePath])
        }
        const img = new Image()
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
            img.onload = () => {
                resolve(img)
            }
            img.onerror = reject;
        })
        img.src = cookiePath
        images[cookiePath] = img;
        return promise;
    }

    return {
        getAsset,
        getAssetImage,
        getEntity,
        getEntityImage,
        getFood,
        getFoodImage,
    }
})