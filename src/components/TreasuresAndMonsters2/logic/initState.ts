import { ConfigTerrainRule, IConfig } from "../config";
import { getVoidState, TMGameState } from "../../gamestates";
import { makeIdRecord } from "./id";
import { mapCardsFromConfig, mapCellTypesFromConfig } from "./mappers";

export function initState(config: IConfig): TMGameState {
  const state = getVoidState();
  console.log("initState config", config);
  console.log("initState  --- make records ");

  state.records.terrainRules = makeIdRecord<ConfigTerrainRule>([...config.terrainRules], "terrain");
  console.log("state.records.terrainRules", state.records.terrainRules);

  state.records.cellTypes = mapCellTypesFromConfig(state.records.terrainRules);
  console.log("state.records.cellTypes", state.records.cellTypes);

  state.records.cards = mapCardsFromConfig(config);
  console.log("state.records.cards", state.records.cards);
  console.log("initState  --- records is done ");

  console.log("todo initState  --- make cells ");


  console.log("todo initState  --- make cards");

  console.log("todo initState  --- init player");

  return state;
};
