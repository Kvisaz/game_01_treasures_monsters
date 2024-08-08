import { ISimpleSpriteGridProps, SimpleHexSpriteGrid } from "../../../SpriteGrid/SimpleHexSpriteGrid";
import { ISpriteGridCell } from "../../../SpriteGrid/interfaces";
import { ITerrainCell, ITerrainRulesMap, TerrainColors, TerrainType } from "../../interfaces";
import { GameCell } from "../cells";

export interface IGameGridProps extends ISimpleSpriteGridProps {
  scene: Phaser.Scene;
  columns: number;
  rows: number;
  cellSize: number;
  onClick: (cell: ISpriteGridCell) => void;
  terrains: ITerrainCell[][];
  terrainRulesMap: ITerrainRulesMap;
  terrainColors: TerrainColors;
}

export class GameGrid extends SimpleHexSpriteGrid {
  constructor(protected props: IGameGridProps) {
    super(props);
  }

  protected createCell(column: number, row: number, cellSize: number) {
    const { scene, terrainRulesMap, terrains, terrainColors } = this.props;

    if (terrains[column][row]) {
      const { terrainType } = terrains[column][row];
      const terrainRule = terrainRulesMap[terrainType];
      const terrainColor = terrainColors[terrainType];

      return new GameCell({
        scene,
        column,
        row,
        cellSize,
        color: terrainColor,
        terrainRule,
      }) as unknown as ISpriteGridCell;
    } else {
      console.warn("UNDEFINED CELL in terrains", column, row);

      const terrainType: TerrainType = "grass";
      const terrainRule = terrainRulesMap[terrainType];
      const color = terrainColors[terrainType];

      return new GameCell({
        scene,
        column,
        row,
        cellSize,
        color,
        terrainRule,
      }) as unknown as ISpriteGridCell;
    }
  }
}
