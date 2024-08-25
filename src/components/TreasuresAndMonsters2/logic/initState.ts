import { IConfig } from "../config";
import { getVoidState, TMGameState } from "../../gamestates";

export function initState(config: IConfig): TMGameState {
  const state = getVoidState();
  console.log('todo initState  --- make cells ');


  console.log('todo initState  --- make cards');

  console.log('todo initState  --- init player');

  return state;
};
