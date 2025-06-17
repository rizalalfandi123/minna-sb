export function alternateArrays<T extends object>(
  arr1: Array<T>,
  arr2: Array<T>
): Array<T & { number: number }> {
  const result: Array<T & { number: number }> = [];

  const maxLength = Math.max(arr1.length, arr2.length);

  let counter = 1;

  for (let i = 0; i < maxLength; i++) {
    if (i < arr1.length) result.push({ ...arr1[i], number: counter++ });
    if (i < arr2.length) result.push({ ...arr2[i], number: counter++ });
  }

  return result;
}
