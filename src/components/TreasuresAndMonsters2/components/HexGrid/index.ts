import { forEach2D, GameObject } from "../../../../common";

type ColumnRow = { column: number, row: number };

interface IProps {
  scene: Phaser.Scene;
  cells2D: ColumnRow[][];
  cellBuilder: (columnRow: ColumnRow) => GameObject;
}

/** to do если не будет привязки к логике - выноси в общие **/
export class HexGrid extends Phaser.GameObjects.Container {

  constructor(private props: IProps) {
    super(props.scene);

    const { cells2D, cellBuilder } = this.props;

    forEach2D(cells2D, columnRow => {
      const gameObject = cellBuilder(columnRow);
      this.add(gameObject);
    });

    props.scene.add.existing(this);
  }
}
