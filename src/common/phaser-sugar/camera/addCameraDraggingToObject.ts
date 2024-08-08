import { GameObject } from "../interfaces";
import Pointer = Phaser.Input.Pointer;

/** объект должен быть интерактивным  AND setOrigin = 0 **/
export function addCameraDraggingToObject(obj: GameObject, width: number, height: number) {
  const { scene } = obj;
  const camera = obj.scene.cameras.main;
  const worldWidth = width;
  const worldHeight = height;

  const prevX = camera.scrollX;
  const prevY = camera.scrollY;

  scene.input.dragDistanceThreshold = 16;
  scene.input.dragTimeThreshold = 100;
  obj.on(Phaser.Input.Events.GAMEOBJECT_DRAG, (pointer: Pointer, dragX: number, dragY: number) => {
    camera.scrollX = Phaser.Math.Clamp(camera.scrollX - dragX, 0, worldWidth - camera.width);
    camera.scrollY = Phaser.Math.Clamp(camera.scrollY - dragY, 0, worldHeight - camera.height);
  });

  return () => {
    camera.scrollX = prevX;
    camera.scrollY = prevY;
  };
}
