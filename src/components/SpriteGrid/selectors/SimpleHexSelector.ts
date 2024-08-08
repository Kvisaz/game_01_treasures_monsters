import { ISimpleGridSelector, ISpriteGridCell } from "../interfaces";
import { SpriteGridHexSelector } from "./SpriteGridHexSelector";

interface IProps {
  scene: Phaser.Scene;
  cellSize: number;
  selectorColor?: string;
}

export class SimpleHexSelector implements ISimpleGridSelector {
  private readonly selector: SpriteGridHexSelector;
  private selectedCell: ISpriteGridCell | undefined;

  constructor(private props: IProps) {
    const { scene, cellSize, selectorColor } = props;
    this.selector = new SpriteGridHexSelector({ scene, cellSize, selectorColor });
    scene.add.existing(this.selector);
  }

  getSelectedCell(): ISpriteGridCell | undefined {
    return this.selectedCell;
  }

  hide(): void {
    this.selectedCell = undefined;
    this.selector.hide();
  }

  show(cell: ISpriteGridCell): void {
    this.selectedCell = cell;
    this.selector.show(this.selectedCell.gameObject);
  }

  switch(cell: ISpriteGridCell) {
    if (cell === this.selectedCell) {
      this.hide();
    } else {
      this.show(cell);
    }
  }

  destroy() {
    this.selector.destroy();
    this.selectedCell = undefined;
  }
}
