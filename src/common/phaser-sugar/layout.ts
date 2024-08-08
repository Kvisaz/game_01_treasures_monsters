import { useCamera } from "./internals";

type Rect = Phaser.Geom.Rectangle;

export interface IBoundable {
  getBounds: () => Rect;
}

interface IPosition {
  x: number;
  y: number;
}

interface IPositionSettable {
  setPosition: (x: number, y: number) => any;
}

interface AlignObject extends IBoundable, IPosition, IPositionSettable {
  getBounds: () => Rect;
  x: number;
  y: number;
  setPosition: (x: number, y: number) => AlignObject;
}

let currentAnchor: Phaser.Geom.Rectangle | undefined = undefined;

function getAnchorBounds(): Phaser.Geom.Rectangle {
  if (currentAnchor == undefined) {
    const { width, height } = useCamera();
    currentAnchor = new Phaser.Geom.Rectangle(0, 0, width, height);
    return currentAnchor;
  } else {
    return currentAnchor;
  }
}

/**
 * set layout anchor
 */
export function anchor(obj: IBoundable) {
  currentAnchor = obj.getBounds();
}

export function anchorBounds(bounds:Phaser.Geom.Rectangle){
  currentAnchor = bounds;
}

let IPointRectangle = new Phaser.Geom.Rectangle(0, 0, 0, 0);

export function anchorPoint(x: number, y: number) {
  IPointRectangle.x = x;
  IPointRectangle.y = y;
  currentAnchor = IPointRectangle;
}

/**
 * align helper
 * inside fn:
 * 1. set anchor object OR will be used camera/screen
 * 2. use any other functions to move any object relative to anchor object
 *
 * внутри fn
 * 1. установите anchor на объект, относительно которого будет использоваться выравнивание
 * 1.1 или будет использоваться камера игры
 * 2. используйте другие функции для перемещения других объектов относительно анкора
 * перемещение происходит моментально, до обновления, поэтому сколько бы не было вызвано функций,
 * на следующий тик таймера все объекты займут последнее вычисленное место
 *
 * @param fn
 */
export function layout(fn: () => void) {
  fn();
  currentAnchor = undefined;
}

export function center(item: AlignObject, oX = 0, oY = 0): AlignObject {
  const iB = item.getBounds();
  const aB = getAnchorBounds();
  const x = aB.x + (aB.width - iB.width) / 2;
  const y = aB.y + (aB.height - iB.height) / 2;
  setLeftTop(item, x + oX, y + oY);
  return item;
}

export function centerX(item: AlignObject, oX = 0): AlignObject {
  const iB = item.getBounds();
  const aB = getAnchorBounds();
  const x = aB.x + (aB.width - iB.width) / 2;
  const y = iB.y;
  setLeftTop(item, x + oX, y);
  return item;
}

export function centerY(item: AlignObject, oY = 0): AlignObject {
  const iB = item.getBounds();
  const aB = getAnchorBounds();
  const x = iB.x;
  const y = aB.y + (aB.height - iB.height) / 2;
  setLeftTop(item, x, y + oY);
  return item;
}

export function bottomIn(item: AlignObject, oY = 0): AlignObject {
  const iB = item.getBounds();
  const aB = getAnchorBounds();
  const x = iB.x;
  const y = aB.y + (aB.height - iB.height);
  setLeftTop(item, x, y + oY);
  return item;
}

export function bottomTo(item: AlignObject, oY = 0): AlignObject {
  const iB = item.getBounds();
  const aB = getAnchorBounds();
  const x = iB.x;
  const y = aB.y + aB.height;
  setLeftTop(item, x, y + oY);
  return item;
}

export function topIn(item: AlignObject, oY = 0): AlignObject {
  const iB = item.getBounds();
  const aB = getAnchorBounds();
  const x = iB.x;
  const y = aB.y;
  setLeftTop(item, x, y + oY);
  return item;
}

export function topTo(item: AlignObject, oY = 0): AlignObject {
  const iB = item.getBounds();
  const aB = getAnchorBounds();
  const x = iB.x;
  const y = aB.y - iB.height;
  setLeftTop(item, x, y + oY);
  return item;
}

export function rightIn(item: AlignObject, oX = 0): AlignObject {
  const iB = item.getBounds();
  const aB = getAnchorBounds();
  const x = aB.x + (aB.width - iB.width);
  const y = iB.y;
  setLeftTop(item, x + oX, y);
  return item;
}

export function rightTo(item: AlignObject, oX = 0): AlignObject {
  const iB = item.getBounds();
  const aB = getAnchorBounds();
  const x = aB.x + aB.width;
  const y = iB.y;
  setLeftTop(item, x + oX, y);
  return item;
}

export function leftIn(item: AlignObject, oX = 0): AlignObject {
  const iB = item.getBounds();
  const aB = getAnchorBounds();
  const x = aB.x;
  const y = iB.y;
  setLeftTop(item, x + oX, y);
  return item;
}

export function leftTo(item: AlignObject, oX = 0): AlignObject {
  const iB = item.getBounds();
  const aB = getAnchorBounds();
  const x = aB.x - iB.width;
  const y = iB.y;
  setLeftTop(item, x + oX, y);
  return item;
}

/**
 * @method setLeftTop - размещает объект с любым Origin
 * для использования без создания Align
 * когда нужно просто разместить объект
 */
export function setLeftTop(
  item: AlignObject,
  left: number,
  top: number
): AlignObject {
  // bounds - реальное положение объекта вне зависимости  от origin
  const iB = item.getBounds();
  // находим разницу между  границами сейчас и что надо
  const dX = left - iB.left;
  const dY = top - iB.top;
  // вычисляем перемещение по осям
  item.setPosition(item.x + dX, item.y + dY);
  return item;
}
