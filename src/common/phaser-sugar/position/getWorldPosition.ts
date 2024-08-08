export interface IWorldBoundable extends Phaser.GameObjects.Components.Transform {
  getBounds(output?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle;
}

export interface IWorldPosition {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

export function getWorldPosition(object: Phaser.GameObjects.Components.Transform): IWorldPosition {
  const tempMatrix = new Phaser.GameObjects.Components.TransformMatrix();
  const tempParentMatrix = new Phaser.GameObjects.Components.TransformMatrix();
  object.getWorldTransformMatrix(tempMatrix, tempParentMatrix);

  // @ts-ignore
  const { translateX, translateY, scaleX, scaleY, rotation } = tempMatrix.decomposeMatrix();
  return {
    x: translateX,
    y: translateY,
    scaleX: scaleX,
    scaleY: scaleY,
    rotation: rotation,
  };
}

export function getWorldBounds(object: IWorldBoundable): Phaser.Geom.Rectangle {
  const bounds = object.getBounds();
  const pos = getWorldPosition(object);
  bounds.setTo(pos.x, pos.y, bounds.width, bounds.height);
  return bounds;
}