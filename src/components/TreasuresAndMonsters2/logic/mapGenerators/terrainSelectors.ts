import { ITerrainRule } from "../../interfaces";
import { TerrainRule, TerrainType } from "../../config";

/** get mono terrain  **/
export function getMonoTerrainBuilder(terrainRules: ITerrainRule[], key?: TerrainType): () => TerrainRule {
  const terrainType: TerrainType = key == null ? "grass" : key;

  return () => (terrainRules.find(rule => rule.type === terrainType) ?? terrainRules[0]) as TerrainRule;
}

/** get a random terrain type based on probability **/
export function getRandomTerrainBuilder(terrainRules: ITerrainRule[]): () => TerrainRule {
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
