import { intToCssColor } from "./intToCssColor";
import { cssColorToInt } from "./cssColorToInt";

export function mutateCssColor(color: string, mutationPower: number): string {
  if (!/^#[0-9A-F]{6}$/i.test(color)) {
    throw new Error('Invalid color format. Use "#RRGGBB".');
  }

  if (mutationPower <= 0) {
    return color;
  }

  // Преобразуем цвет из HEX в число
  let colorInt = cssColorToInt(color);

  // Извлекаем компоненты RGB из числа
  let r = (colorInt >> 16) & 0xff;
  let g = (colorInt >> 8) & 0xff;
  let b = colorInt & 0xff;

  // Генерация случайного числа в диапазоне [-1, 1]
  function randomOffset(): number {
    return Math.random() * 2 - 1;
  }

  // Изменяем каждый цветовой компонент пропорционально mutationPower
  r = Math.min(255, Math.max(0, Math.round(r + randomOffset() * mutationPower * 255)));
  g = Math.min(255, Math.max(0, Math.round(g + randomOffset() * mutationPower * 255)));
  b = Math.min(255, Math.max(0, Math.round(b + randomOffset() * mutationPower * 255)));

  // Преобразуем компоненты RGB обратно в число
  colorInt = (r << 16) | (g << 8) | b;

  // Преобразуем число обратно в HEX цвет
  return intToCssColor(colorInt);
}
//
// // Пример использования
// console.log(mutateColor("#358C54", 0)); // "#358C54"
// console.log(mutateColor("#358C54", 0.5)); // Цвет слегка изменён
// console.log(mutateColor("#358C54", 1)); // Цвет изменён максимально
