import { getWorldPosition, IWorldPosition } from "./getWorldPosition";

export interface IScreenObject extends Phaser.GameObjects.Components.Transform {
  scene: Phaser.Scene;
}

export function getScreenPosition(object: IScreenObject): IWorldPosition {
  const worldPosition = getWorldPosition(object);
  const cameraPosition = object.scene.cameras.main.getBounds();

  return {
    ...worldPosition,
    x: worldPosition.x - cameraPosition.x,
    y: worldPosition.y - cameraPosition.y,
  };
}
