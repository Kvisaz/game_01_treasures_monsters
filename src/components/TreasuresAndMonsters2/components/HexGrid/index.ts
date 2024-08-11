import { forEach2D, GameObject, setLeftTop } from "../../../../common";
import Pointer = Phaser.Input.Pointer;

type ColumnRow = { column: number, row: number };

interface IProps {
  scene: Phaser.Scene;
  cells2D: ColumnRow[][];
  cellBuilder: (columnRow: ColumnRow) => GameObject;
}

/** to do если не будет привязки к логике - выноси в общие **/
export class HexGrid extends Phaser.GameObjects.Container {

  private readonly unSubs: (() => void)[] = [];
  /** обработчик кликов и драггинга камеры **/
  private readonly inputRect: Phaser.GameObjects.Rectangle;

  constructor(private props: IProps) {
    super(props.scene);

    const { cells2D, cellBuilder } = this.props;

    forEach2D(cells2D, columnRow => {
      const gameObject = cellBuilder(columnRow);
      this.add(gameObject);
    });
    const clickables = [...this.list];

    this.inputRect = this.createInputRect();
    this.addAt(this.inputRect);

    props.scene.add.existing(this);
    this.unSubs.push(setupCameraDrag(this.scene, this.inputRect, clickables as GameObject[]));
  }

  destroy(fromScene?: boolean) {
    super.destroy(fromScene);
    this.unSubs.forEach(unSub => unSub());
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
}

function setupCameraDrag(scene: Phaser.Scene, inputRect: GameObject, clickables?: GameObject[]) {
  let isDragging = false;
  let isClickLocked = false;
  const camera = scene.cameras.main;
  let startX: number, startY: number;

  const prevX = camera.scrollX;
  const prevY = camera.scrollY;
  //
  // inputRect.setInteractive({
  //   useHandCursor: true,
  //   draggable: true
  // });

  scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Pointer) => {
    console.log("GAMEOBJECT_DRAG_START");
    isDragging = true;
    isClickLocked = true;
    startX = pointer.x + camera.scrollX;
    startY = pointer.y + camera.scrollY;
  });

  scene.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Pointer) => {
    if (!isDragging) return;
    console.log("POINTER_MOVE");
    const deltaX = startX - pointer.x;
    const deltaY = startY - pointer.y;

    // Ограничиваем движение камеры размерами контейнера
    camera.scrollX = Phaser.Math.Clamp(
      deltaX,
      0,
      Math.max(0, inputRect.width - camera.width)
    );
    camera.scrollY = Phaser.Math.Clamp(
      deltaY,
      0,
      Math.max(0, inputRect.height - camera.height)
    );
  });

  scene.input.on('pointerup', () => {
    console.log("pointerup");
    isDragging = false;
    inputRect.scene.time.addEvent({
      delay: 500,
      callback: () => {
        isClickLocked = false;
        console.log("GAMEOBJECT_DRAG_END fired");
      }
    });
  });

  // scene.input.on('pointerup', () => {
  //   console.log("GAMEOBJECT_DRAG_END");
  //   isDragging = false;
    inputRect.scene.time.addEvent({
      delay: 500,
      callback: () => {
        isClickLocked = false;
        console.log("GAMEOBJECT_DRAG_END fired");
      }
    });
  // });

  // Добавляем обработку кликов по ячейкам
  clickables?.forEach((cell: GameObject) => {
    cell.setInteractive();
    cell.on('pointerup', (pointer: Pointer, localX: number, localY: number, e: { stopPropagation: () => void }) => {
      if (isClickLocked) return;
        // Обработка клика по ячейке
        console.log("Клик по ячейке:", cell);
        // Здесь можно добавить вашу логику обработки клика
        e.stopPropagation(); // Предотвращаем распространение события
    });
  });

  return () => {
    console.log('unsub');
    camera.scrollX = prevX;
    camera.scrollY = prevY;
  };
}
