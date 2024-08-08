/**
 * возвращает случайный элемент из массива
 * не используя создание нового массива
 * максимально экономичным способом
 * если задан filter, то отбор происходит только среди ячеек
 * для которых filter ===  true
 */
export function getRandomArrayElementWithFilter<T>(arr: T[], filter?: FilterCallback<T>): T {
  if (arr.length === 0) {
    throw new Error("Array is empty"); // Выбрасываем исключение, если массив пуст
  }

  let candidate: T | undefined = undefined;
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    if (filter === undefined || filter(arr[i])) {
      count++; // Увеличиваем счетчик найденных элементов
      // С вероятностью 1/count выбираем текущий элемент как кандидата
      if (Math.random() < 1 / count) {
        candidate = arr[i];
      }
    }
  }

  if (candidate == null) {
    // Это состояние достигается, если ни один элемент не прошел фильтр
    throw new Error("No element matches the filter criteria");
  }

  return candidate;
}

type FilterCallback<T> = (el: T) => boolean;

export const getRandomArrayElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
