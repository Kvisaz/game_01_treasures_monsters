import { forEach2DWithoutArray, GameObject } from "../../../../common";
import { setupCameraDrag } from "./setupCameraDrag";


interface IProps {
  scene: Phaser.Scene;
  columns: number;
  rows: number;
  cellBuilder: (column: number, row: number) => GameObject;
  onClick: (column: number, row: number) => void;
}

/** to do если не будет привязки к логике - выноси в общие **/
export class HexGrid extends Phaser.GameObjects.Container {

  private readonly unSubs: (() => void)[] = [];
  private readonly resetCamera?: () => void;

  constructor(private props: IProps) {
    super(props.scene);
    const { scene, cellBuilder, columns, rows, onClick } = props;
    const clickables: GameObject[] = [];
    forEach2DWithoutArray(columns, rows, (column, row) => {
      const gameObject = cellBuilder(column, row);
      gameObject.setData("column", column);
      gameObject.setData("row", row);
      clickables.push(gameObject);
      this.add(gameObject);
    });

    const { resetCamera, isInputAllowed } = setupCameraDrag({ scene, gameObject: this });
    this.resetCamera = resetCamera;

    clickables?.forEach((clickable: GameObject) => {
      clickable.setInteractive({ useHandCursor: true });
      clickable.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        if (!isInputAllowed()) return;
        const column = clickable.getData("column") as number | undefined;
        const row = clickable.getData("row") as number | undefined;

        if (column != null && row != null) {
          onClick(column, row);
        } else {
          console.error("no columnRow data for clickable object", clickable);
        }
      });
    });

    scene.add.existing(this);
  }

  destroy(fromScene?: boolean) {
    super.destroy(fromScene);
    this.unSubs.forEach(unSub => unSub());
    this.resetCamera?.();
  }
}
