import { CardType, CellTypeId, ICard, IdCellType, IdRecord, ITerrain } from "../../../gamestates";
import { ConfigTerrainRule, IConfig, IConfigCard } from "../../config";
import { getIdRecordArray } from "../id";

export function mapTerrainRulesFromConfig(terrainRules: ConfigTerrainRule[]): IdRecord<ITerrain> {
  const terrainRecords: IdRecord<ITerrain> = {};
  terrainRules.forEach((rule, i) => {
    const id = rule.type;
    terrainRecords[id] = { ...rule, id };
  });
  return terrainRecords;
}

export function mapCellTypesFromConfig(terrainRules: IdRecord<ConfigTerrainRule>): Record<CellTypeId, IdCellType> {
  const cellTypes: Record<CellTypeId, IdCellType> = {};
  const terrainRulesArray = getIdRecordArray(terrainRules);
  terrainRulesArray.forEach((rule, id) => {
    const cellType: IdCellType = {
      id,
      terrainRuleId: rule.id
    };
    cellTypes[id] = cellType;
  });
  return cellTypes;
}

export function mapCardsFromConfig(config: IConfig): IdRecord<ICard> {
  const prefix = "card";
  const cards: IdRecord<ICard> = {};

  /** **/
  config.cards.forEach((configCard, i) => {
    const id = `${prefix}_${i}`;
    const logicCard: ICard = {
      ...configCard,
      id,
      type: mapConfigCardTypeToLogicCardType(configCard),
    };
    cards[id] = logicCard;

  });

  return cards;
}

export function mapConfigCardTypeToLogicCardType(configCard: IConfigCard): CardType {
  let type = CardType[configCard.type] as CardType | undefined;
  if (type == null) {
    console.warn('CardType.not_set', configCard);
    type = CardType.not_set;
  }
  return type;
}
