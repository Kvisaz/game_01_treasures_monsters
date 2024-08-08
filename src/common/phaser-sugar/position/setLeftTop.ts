interface IPositionable {
  x: number;
  y: number;

  getBounds(): Phaser.Geom.Rectangle;

  setPosition(x: number, y: number): Phaser.GameObjects.GameObject;
}

export function setLeftTop(obj: IPositionable, left: number, top: number) {
  // visible bounds of object
  const { left: oL, top: oT } = obj.getBounds();
  const dX = left - oL;
  const dY = top - oT;
  // object x, y !== visible bounds x.y
  obj.setPosition(obj.x + dX, obj.y + dY);
}

export function setLeft(obj: IPositionable, left: number) {
  obj.x += left - obj.getBounds().left;
}

export function setTop(obj: IPositionable, top: number) {
  obj.y += top - obj.getBounds().top;
}