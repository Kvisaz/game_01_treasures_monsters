import { Id, IdObject, IdRecord } from "../../../gamestates";

/** сделать из массива обычных типов T - id запись объектов
 * с добавлением в объект id по номеру массива
 * id берется исключительно из номера массива
 **/
export function makeIdRecord<T>(arr: T[], idPrefix: string): IdRecord<T> {
  const record: IdRecord<T> = {};
  arr.forEach((idObject, index) => {
    const id: Id = `${idPrefix}_${index}`;
    record[id] = { id, ...idObject };
  });

  return record;
}

export function getIdRecordArray<T>(idRecord: IdRecord<T>): IdObject<T>[] {
  const arr: IdObject<T>[] = [];
  Object.values(idRecord).forEach(obj => {
    if (obj == null) return;
    arr.push(obj);
  });
  return arr;
}
