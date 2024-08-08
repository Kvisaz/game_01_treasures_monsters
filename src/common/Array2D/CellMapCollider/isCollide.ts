import { IPlace } from "./interfaces";

/**
 *  проверка на коллизию
 *  срабатывает если объекты рядом вплотную
 */
export function isCollide(obj1: IPlace, obj2: IPlace): boolean {
  if (obj1 == obj2) return false; // объект не может сталкивать сам с собой
  return (
    obj1.left <= obj2.left + obj2.width &&
    obj1.left + obj1.width >= obj2.left &&
    obj1.top <= obj2.top + obj2.height &&
    obj1.top + obj1.height >= obj2.top
  );
}
