export type AlignObject =
  | Phaser.GameObjects.Container
  | Phaser.GameObjects.Image
  | Phaser.GameObjects.Text
  | Phaser.GameObjects.RenderTexture
  | Phaser.GameObjects.Shape
  | Phaser.GameObjects.TileSprite;

// for origin == 0
// all offsets move to right && down by default
// chainable methods
export class Align {
  private anchorItem: ISizeable | undefined;
  private static errorSetAnchorMessage = 'set anchor in Align first';

  constructor(anchorItem?: ISizeable) {
    if (anchorItem) this.anchorItem = anchorItem;
  }

  /**
   * объект относительно которого надо выравнивать
   * @param item
   */
  anchor(item: ISizeable): this {
    this.anchorItem = item;
    return this;
  }

  /**
   * Для выравнивания относительно экрана
   * создается легкий делегат с нулевыми координатами
   * @param width
   * @param height
   */
  anchorScreen(width: number, height: number): this {
    return this.anchor({
      getBounds: () => new Phaser.Geom.Rectangle(0, 0, width, height),
    });
  }

  anchorSceneScreen(scene: Phaser.Scene): this {
    const { width, height } = scene.cameras.main;
    return this.anchorScreen(width, height);
  }

  center(item: AlignObject, oX = 0, oY = 0): this {
    return this.applyFormula(item, oX, oY, ({ aB, iB }) => ({
      x: aB.x + (aB.width - iB.width) / 2,
      y: aB.y + (aB.height - iB.height) / 2,
    }));
  }

  centerX(item: AlignObject, oX = 0): this {
    return this.applyFormula(item, oX, 0, ({ aB, iB }) => ({
      x: aB.x + (aB.width - iB.width) / 2,
      y: iB.y,
    }));
  }

  centerY(item: AlignObject, oY = 0): this {
    return this.applyFormula(item, 0, oY, ({ aB, iB }) => ({
      x: iB.x,
      y: aB.y + (aB.height - iB.height) / 2,
    }));
  }

  bottomIn(item: AlignObject, oY = 0): this {
    return this.applyFormula(item, 0, oY, ({ aB, iB }) => ({
      x: iB.x,
      y: aB.y + (aB.height - iB.height),
    }));
  }

  bottomTo(item: AlignObject, oY = 0): this {
    return this.applyFormula(item, 0, oY, ({ aB, iB }) => ({
      x: iB.x,
      y: aB.y + aB.height,
    }));
  }

  topIn(item: AlignObject, oY = 0): this {
    return this.applyFormula(item, 0, oY, ({ aB, iB }) => ({
      x: iB.x,
      y: aB.y,
    }));
  }

  topTo(item: AlignObject, oY = 0): this {
    return this.applyFormula(item, 0, oY, ({ aB, iB }) => ({
      x: iB.x,
      y: aB.y - iB.height,
    }));
  }

  rightIn(item: AlignObject, oX = 0): this {
    return this.applyFormula(item, oX, 0, ({ aB, iB }) => ({
      x: aB.x + (aB.width - iB.width),
      y: iB.y,
    }));
  }

  rightTo(item: AlignObject, oX = 0): this {
    return this.applyFormula(item, oX, 0, ({ aB, iB }) => ({
      x: aB.x + aB.width,
      y: iB.y,
    }));
  }

  leftIn(item: AlignObject, oX = 0): this {
    return this.applyFormula(item, oX, 0, ({ aB, iB }) => ({
      x: aB.x,
      y: iB.y,
    }));
  }

  leftTo(item: AlignObject, oX = 0): this {
    return this.applyFormula(item, oX, 0, ({ aB, iB }) => ({
      x: aB.x - iB.width,
      y: iB.y,
    }));
  }

  /**
   * @method setPosition - размещает объект с любым Origin
   * для использования в цепочках с выравниванием по анкору
   * @param item
   * @param left
   * @param top
   */
  setPosition(item: AlignObject, left: number, top: number): this {
    Align.setLeftTop(item, left, top);
    return this;
  }

  /**
   * @method setLeftTop - размещает объект с любым Origin
   * для использования без создания Align
   * когда нужно просто разместить объект
   * @param item
   * @param left
   * @param top
   */
  static setLeftTop(item: AlignObject, left: number, top: number) {
    // bounds - реальное положение объекта вне зависимости  от origin
    const iB = item.getBounds();
    // находим разницу между  границами сейчас и что надо
    const dX = left - iB.left;
    const dY = top - iB.top;
    // вычисляем перемещение по осям
    const x = item.x + dX;
    const y = item.y + dY;
    // применяем перемещение
    item.setPosition(x, y);
  }

  // выстроить объекты в ряд с расстоянием dX, друг за другом
  row(items: AlignObject[], dX: number): this {
    this.anchor(items[0]);
    for (let i = 1; i < items.length; i++) {
      const next = items[i];
      this.rightTo(next, dX);
      this.anchor(next);
    }
    return this;
  }

  // выстроить объекты в колонку с расстоянием dY, друг за другом
  column(items: AlignObject[], dY: number): this {
    this.anchor(items[0]);
    for (let i = 1; i < items.length; i++) {
      const next = items[i];
      this.bottomTo(next, dY);
      this.anchor(next);
    }
    return this;
  }

  private applyFormula(item: AlignObject, oX: number, oY: number, formula: IAlignFormula): this {
    const { anchorItem } = this;
    if (anchorItem == null) {
      console.warn(Align.errorSetAnchorMessage);
      return this;
    }
    if (item == null) {
      console.warn(Align.errorSetAnchorMessage);
      return this;
    }

    const { x, y } = formula(this.getBounds(item, anchorItem));
    this.setPosition(item, x + oX, y + oY);

    return this;
  }

  private getBounds(item: ISizeable, anchor: ISizeable): IBoundsPair {
    return {
      aB: anchor?.getBounds(),
      iB: item?.getBounds(),
    };
  }
}

interface ISizeable {
  getBounds(): Phaser.Geom.Rectangle;
}

interface IBoundsPair {
  aB: Phaser.Geom.Rectangle;
  iB: Phaser.Geom.Rectangle;
}

interface IPosition {
  x: number;
  y: number;
}

interface IAlignFormula {
  (bounds: IBoundsPair): IPosition;
}
