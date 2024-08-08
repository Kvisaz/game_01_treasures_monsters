import { IPoint } from "./interfaces";
import { getDistance } from "./getDistance";

/**
 * точки рядом?
 */
export function isNearPoint(point1: IPoint, point2: IPoint, nearDistance: number) {
  return getDistance(point1, point2) <= nearDistance;
}
