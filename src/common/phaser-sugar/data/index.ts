import { GameObject } from "../interfaces";

export function setGameObjectData<T>(obj: GameObject, data: T) {
  obj.setData(data);
}

export function getGameObjectData<T>(obj: GameObject): Partial<T> | undefined {
  return obj.data.getAll() as Partial<T> | undefined;
}
