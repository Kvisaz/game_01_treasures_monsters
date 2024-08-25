import { ColumnRow, ColumnRowNumber } from "../TMGameState";

export const getColumnRowNumber = (columnRow: ColumnRow, columns: number): ColumnRowNumber => columnRow.column + columnRow.row * columns;

export const getColumnRowFromNumber = (columnRowNumber: ColumnRowNumber, columns: number): ColumnRow => {


  return {
    column: columnRowNumber % columns,
    row: Math.floor(columnRowNumber / columns)
  };
};
