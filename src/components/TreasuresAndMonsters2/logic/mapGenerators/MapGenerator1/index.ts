import { ICellState, ITerrainRule } from "../../../interfaces";
import { makeArray2D } from "../../../../../common";
import { TerrainRule } from "../../../config";

interface IProps {
  columns: number;
  rows: number;
  terrainRules: ITerrainRule[];
}

interface IResult {
  cells2D: ICellState[][];
}

export class MapGenerator1 {

  static run({ columns, rows, terrainRules }: IProps): IResult {

    const getRandomTerrain = getRandomTerrainBuilder(terrainRules);

    const cells2D = makeArray2D(columns, rows, (column, row) => {
      return {
        column, row, terrain: getRandomTerrain()
      };
    });

    return {
      cells2D
    };
  }
}

/** get a random terrain type based on probability **/
function getRandomTerrainBuilder(terrainRules: ITerrainRule[]): () => TerrainRule {
  const totalProbability = terrainRules.reduce((sum, rule) => sum + rule.probability, 0);

  return () => {
    const rand = Math.random() * totalProbability;
    let cumulative = 0;
    for (const rule of terrainRules) {
      cumulative += rule.probability;
      if (rand < cumulative) {
        return rule as TerrainRule;
      }
    }
    return terrainRules[terrainRules.length - 1] as TerrainRule; // Fallback
  };
}
