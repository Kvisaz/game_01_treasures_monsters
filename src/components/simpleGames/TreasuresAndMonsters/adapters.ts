/**
 * Преобразование карты правил в массив правил
 */
import { CardType, FigureType, ITerrainRule, ITerrainRulesMap } from "./interfaces";

export function getTerrainRulesArray(terrainRulesMap: ITerrainRulesMap): ITerrainRule[] {
  return Object.values(terrainRulesMap);
}

/**
 * Преобразование массива правил в карту правил
 */
export function getTerrainRulesMap(terrainRules: ITerrainRule[]): ITerrainRulesMap {
  return terrainRules.reduce((map, rule) => {
    map[rule.type] = rule;
    return map;
  }, {} as ITerrainRulesMap);
}

export function sortByCardTypes<T extends { type: CardType }>(sortables: T[]): Record<CardType, T[]> {
  const result: Record<CardType, T[]> = {
    player: [],
    monster: [],
    treasure: [],
  };

  sortables.forEach((object) => {
    result[object.type].push(object);
  });

  return result;
}
