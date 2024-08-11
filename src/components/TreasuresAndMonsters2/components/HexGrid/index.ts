import { addCameraDraggingToObject, forEach2D, GameObject, setLeftTop } from "../../../../common";
import Pointer = Phaser.Input.Pointer;

type ColumnRow = { column: number, row: number };

interface IProps {
  scene: Phaser.Scene;
  cells2D: ColumnRow[][];
  cellBuilder: (columnRow: ColumnRow) => GameObject;
}

const CLICK_EVENT = Phaser.Input.Events.GAMEOBJECT_POINTER_UP;
const DRAG_TIME_BEFORE_CLICK = 500;

/** to do если не будет привязки к логике - выноси в общие **/
export class HexGrid extends Phaser.GameObjects.Container {

  private readonly unSubs: (() => void)[] = [];
  /** обработчик кликов и драггинга камеры **/
  private readonly inputRect: Phaser.GameObjects.Rectangle;
  private isInputDragging = false;
  private resetCamera?: () => void;

  constructor(private props: IProps) {
    super(props.scene);

    const { cells2D, cellBuilder } = this.props;

    forEach2D(cells2D, columnRow => {
      const gameObject = cellBuilder(columnRow);
      this.add(gameObject);
    });

    this.inputRect = this.createInputRect();
    this.addAt(this.inputRect);

    this.bindEvents();

    props.scene.add.existing(this);
  }

  destroy(fromScene?: boolean) {
    super.destroy(fromScene);
    this.unSubs.forEach(unSub => unSub());
    this.inputRect.destroy();
    this.resetCamera?.();
  }

  /**
   * создаем прямоугольник для перетаскивания
   **/
  private createInputRect(): Phaser.GameObjects.Rectangle {
    const { scene } = this.props;
    const { width, height } = this.getBounds();
    const rect = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, height).setOrigin(0);
    setLeftTop(rect, 0, 0);
    scene.add.existing(rect);

    return rect;
  }

  private bindEvents() {
    this.inputRect.setInteractive({
      useHandCursor: true,
      draggable: true,
    });

    this.bindClick();
    this.bindDraggingCamera();
    this.bindDisableClicksWhenDragging();
  }

  private bindClick() {
    /** Я выбираю такой способ привязки эвентов
     * чтобы не перегружать код обычных тайлов
     * и иметь возможность разруливать настройку драггинга и кликов в одном месте
     **/
    this.inputRect.on(CLICK_EVENT, (pointer: Pointer, ...args: unknown[]) => {
      const { worldX: x, worldY: y } = pointer;
      if (this.isInputDragging) {
        return;
      }
      console.log('click on cell', x, y, pointer);
      console.log('args', ...args);
      // const cell = this.getCellByXY(x, y);

      // if (cell == null) {
      //   console.warn("critical error: cell undefined!");
      //   console.warn(`x ${x} y ${y}`);
      //   return;
      // } else {
      //   // this.props.onClick(cell);
      // }
    });
  }




  private bindDraggingCamera() {
    const rect = this.inputRect;
    const { width, height } = rect.getBounds();

    this.resetCamera = addCameraDraggingToObject(rect, width, height);
  }

  private bindDisableClicksWhenDragging() {
    this.inputRect.on(Phaser.Input.Events.GAMEOBJECT_DRAG_START, () => {
      this.isInputDragging = true;
    });

    this.inputRect.on(Phaser.Input.Events.GAMEOBJECT_DRAG_END, () => {
      this.inputRect.scene.time.addEvent({
        delay: DRAG_TIME_BEFORE_CLICK,
        callback: () => {
          this.isInputDragging = false;
        },
      });
    });
  }
}
