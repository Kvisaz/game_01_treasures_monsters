import { getAbstractGridPath } from "./getAbstractGridPath";
import { getHexNearsInRadius } from "../HexArray";
import { ColumnRow, WalkableCallback } from "./interfaces";

interface IGetHexPathProps {
  from: ColumnRow;
  to: ColumnRow;
  isWalkable?: WalkableCallback;
  columnMin?: number;
  columnMax?: number;
  rowMin?: number;
  rowMax?: number;
  maxChecks?: number;
}

/**
 *  Поиск пути между клетками на гексагональной доске
 *  - оптимизирует поиск выбирая ближайших соседей между стартом и финишом
 *  - отбрасывает варианты за пределами доски
 *  - имеет ограничение на число проверок maxChecks
 *  - может проверять,  проходима клетко или нет!
 *  - время поиска - 0-1 ms даже для путей в сто клеток на MacBook
 * **/
export function getHexGridPath(props: IGetHexPathProps): ColumnRow[] {
  return getAbstractGridPath({
    ...props,
    getNears: (column, row)=> getHexNearsInRadius(column, row, 1)
  })
}
