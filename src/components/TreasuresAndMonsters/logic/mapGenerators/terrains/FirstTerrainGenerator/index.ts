import { ITerrainCell, ITerrainGenerator, ITerrainRule, TerrainType } from "../../../../interfaces";

interface IProps {
  /** размеры двухмерного массива **/
  columns: number;
  rows: number;
  /** правила заполнения ячеек разными типами поверхности **/
  terrainRules: ITerrainRule[];
}

export class FirstTerrainGenerator implements ITerrainGenerator {
  constructor(private props: IProps) {}

  generateCells(): ITerrainCell[][] {
    const { columns, rows, terrainRules: terrainRulesMap } = this.props;

    const terrainRules = Object.values(terrainRulesMap);
    // Calculate the total weight of all probabilities
    const totalProbability = terrainRules.reduce((sum, rule) => sum + rule.probability, 0);

    // Function to get a random terrain type based on probability
    const getRandomTerrainType = (): TerrainType => {
      const rand = Math.random() * totalProbability;
      let cumulative = 0;
      for (const rule of terrainRules) {
        cumulative += rule.probability;
        if (rand < cumulative) {
          return rule.type;
        }
      }
      return terrainRules[terrainRules.length - 1].type; // Fallback
    };

    // Initialize the map with random terrains
    const terrainCells: ITerrainCell[][] = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({
        terrainType: getRandomTerrainType(),
      }))
    );

    return terrainCells;
  }
}
