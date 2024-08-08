import { IPoint } from "./interfaces";

/**
 * расстояние между двумя точками (объектами с полями x и y)
 */
export function getDistance(point1: IPoint, point2: IPoint) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}
