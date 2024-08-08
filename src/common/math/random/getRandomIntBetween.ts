export function getRandomIntBetween(min: number, max: number, step = 1): number {
  min = Math.min(min, max);
  max = Math.max(min, max);
  step = Math.abs(step);

  if (step <= 0) {
    console.error("Step must be a positive number.");
    step = step > 0 ? step : 1;
  }

  // Рассчитываем количество возможных шагов в заданном диапазоне
  const range = Math.floor((max - min) / step);

  // Генерируем случайное количество шагов от 0 до range включительно
  const randomSteps = Math.floor(Math.random() * (range + 1));

  // Рассчитываем результат, добавляя случайное количество шагов к минимальному значению
  return min + randomSteps * step;
}
