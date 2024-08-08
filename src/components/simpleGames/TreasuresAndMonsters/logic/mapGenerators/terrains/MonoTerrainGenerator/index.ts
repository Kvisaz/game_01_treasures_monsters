import { ITerrainCell, ITerrainGenerator, ITerrainRule, TerrainType } from "../../../../interfaces";
import { makeArray2D } from "../../../../../../../common";

interface IProps {
  columns: number;
  rows: number;
  terrainType?: TerrainType;
}

export class MonoTerrainGenerator {
  constructor(private props: IProps) {}

  generateCells(): ITerrainCell[][] {
    const { columns, rows, terrainType = "grass" } = this.props;

    // Initialize the map with random terrains
    const terrainCells: ITerrainCell[][] = makeArray2D(columns, rows, (col, row) => {
      return {
        terrainType,
      };
    });

    console.log("terrainCells", terrainCells);

    return terrainCells;
  }
}
