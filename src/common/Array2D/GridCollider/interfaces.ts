import { Array2D } from "../Array2D";
import { IArray2DCell } from "../interfaces";

export type Id = string | number;

export interface IPlace {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface GridColliderObject extends IPlace {
  id: Id;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface InnerGridColliderObject extends GridColliderObject {
  cells: Array<GridColliderCell>;
}

export type GridColliderObjectMap = Record<Id, GridColliderObject>;

export type GridColliderArray2D = Array2D<GridColliderObjectMap>;

export type GridColliderCell = IArray2DCell<GridColliderObjectMap>;
