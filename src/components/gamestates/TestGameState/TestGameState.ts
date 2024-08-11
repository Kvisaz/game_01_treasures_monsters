import { State } from "../../../common";

export interface ITestGameState {
  name: string;
  health: number;
}

/**
 * вызывай это в начале игры
 * храни в мегакомпоненте
 * передавай умным компонентам через конструктор
 **/
export const getNewTestGameState = () => new State<ITestGameState>({
  name: "Vasya",
  health: 12
});
