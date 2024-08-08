import { GameObject } from "./interfaces";

export const scaleToWidth = (obj: GameObject, width: number) => {
    const k = width / obj.displayWidth;
    obj.setScale(k * obj.scale);
}
