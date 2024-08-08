import { ICollideRectangle } from "./interfaces";

/**
 *  проверка на пересечению - тяжелая коллизия
 *  не срабатывает если объекты рядом вплотную
 */
export function isIntersect(obj1: ICollideRectangle, obj2: ICollideRectangle) {
  return (
    obj1.left < obj2.left + obj2.width &&
    obj1.left + obj1.width > obj2.left &&
    obj1.top < obj2.top + obj2.height &&
    obj1.top + obj1.height > obj2.top
  );
}
