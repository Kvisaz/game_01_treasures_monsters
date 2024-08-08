export type ColumnRow = { column: number; row: number };

/** элемент списка по с>ути, указывает на предыдущую ячейку **/
export type PathNode = {
  cell: ColumnRow;
  cost: number;
  previous?: PathNode;
};

export type WalkableCallback = (column: number, row: number) => boolean;
export const isAllWalkable: WalkableCallback = (column: number, row: number) => true;

export interface IGetPathArray2DProps {
  from: ColumnRow;
  to: ColumnRow;
  isWalkable?: WalkableCallback;
  columnMin?: number;
  columnMax?: number;
  rowMin?: number;
  rowMax?: number;
  maxChecks?: number;
  getNears: (column: number, row: number) => ColumnRow[];
}
