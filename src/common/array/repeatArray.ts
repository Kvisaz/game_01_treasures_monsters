export function repeatArray<T>(arr: T[], length: number): T[] {
  if (length <= 0) return [];

  const result: T[] = [];
  let index = 0;

  while (result.length < length) {
    result.push(arr[index]);
    index = (index + 1) % arr.length;
  }

  return result;
}
