import { IConfig } from "../config";
import { getVoidState, TMGameState, TMTerrainType } from "../../gamestates";
import { mapCardsFromConfig, mapCellTypesFromConfig, mapTerrainRulesFromConfig } from "./mappers";
import { generateMonoTerrainCellIds } from "./mapGenerators";

export function initState(config: IConfig): TMGameState {
  const state = getVoidState();
  console.log("initState config", config);
  console.log("initState  --- make records ");

  state.records.terrainRules = mapTerrainRulesFromConfig([...config.terrainRules]);
  console.log("state.records.terrainRules", state.records.terrainRules);

  state.records.cellTypes = mapCellTypesFromConfig(state.records.terrainRules);
  console.log("state.records.cellTypes", state.records.cellTypes);

  state.records.cards = mapCardsFromConfig(config);
  console.log("state.records.cards", state.records.cards);
  console.log("initState  --- records is done ");
  state.cells = generateMonoTerrainCellIds(config, state, TMTerrainType.grass);
  console.log("initState  --- cells ", state.cells);
  console.log("todo initState  --- make cells ");


  console.log("todo initState  --- make cards");

  console.log("todo initState  --- init player");

  return state;
};
