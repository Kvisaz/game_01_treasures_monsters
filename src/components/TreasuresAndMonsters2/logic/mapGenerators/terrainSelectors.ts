import { ITerrainRule } from "../../interfaces";
import { ConfigTerrainRule, ConfigTerrainType } from "../../config";
import { TMTerrainType } from "../../../gamestates";

/** @deprecated  get mono terrain  **/
export function getMonoTerrainBuilder(terrainRules: ITerrainRule[], key?: ConfigTerrainType): () => ConfigTerrainRule {
  const terrainType: ConfigTerrainType = key == null ? TMTerrainType.grass : key;

  return () => (terrainRules.find(rule => rule.type === terrainType) ?? terrainRules[0]) as ConfigTerrainRule;
}

/** @deprecated get a random terrain type based on probability **/
export function getRandomTerrainBuilder(terrainRules: ITerrainRule[]): () => ConfigTerrainRule {
  const totalProbability = terrainRules.reduce((sum, rule) => sum + rule.probability, 0);

  return () => {
    const rand = Math.random() * totalProbability;
    let cumulative = 0;
    for (const rule of terrainRules) {
      cumulative += rule.probability;
      if (rand < cumulative) {
        return rule as ConfigTerrainRule;
      }
    }
    return terrainRules[terrainRules.length - 1] as ConfigTerrainRule; // Fallback
  };
}
