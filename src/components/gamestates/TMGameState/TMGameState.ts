import { State } from "../../../common";
import { ICellState } from "../../TreasuresAndMonsters2/interfaces";

/** Состояние игры Сокровища и монстры - поле, фигурые, игрок **/
export interface TMGameState {
  cells: ICellState[][];
}


export interface ITMGameStateConfig {
  columns: number;
  rows: number;
}

export const getNewTMGameState = (config: ITMGameStateConfig) => {

  const cells: ICellState[][] = [];

  const state = new State<TMGameState>({
    cells
  });

  return state;
};

