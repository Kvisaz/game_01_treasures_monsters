import { forEach2D, GameObject } from "../../../../common";
import { setupCameraDrag } from "./setupCameraDrag";

type ColumnRow = { column: number, row: number };

interface IProps {
  scene: Phaser.Scene;
  cells2D: ColumnRow[][];
  cellBuilder: (columnRow: ColumnRow) => GameObject;
  onClick: (columnRow: ColumnRow) => void;
}

/** to do если не будет привязки к логике - выноси в общие **/
export class HexGrid extends Phaser.GameObjects.Container {

  private readonly unSubs: (() => void)[] = [];
  private readonly resetCamera?: () => void;

  constructor(private props: IProps) {
    super(props.scene);
    const { scene, cellBuilder, cells2D, onClick } = props;
    const clickables: GameObject[] = [];
    forEach2D(cells2D, columnRow => {
      const gameObject = cellBuilder(columnRow);
      gameObject.setData("columnRow", columnRow);
      clickables.push(gameObject);
      this.add(gameObject);
    });

    const { resetCamera, isInputAllowed } = setupCameraDrag({ scene, container: this });
    this.resetCamera = resetCamera;

    clickables?.forEach((clickable: GameObject) => {
      clickable.setInteractive();
      clickable.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        if (!isInputAllowed()) return;
        const columnRow = clickable.getData("columnRow") as ColumnRow | undefined;
        if(columnRow){
          onClick(columnRow);
        } else {
          console.error('no columnRow data for clickable object', clickable);
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

