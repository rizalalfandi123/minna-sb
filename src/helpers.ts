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

export function pickRandomItem<T>(
  items: T[],
  shouldExclude?: (items: T[]) => T[]
): { picked: T | null; others: T[] } {
  // Get excluded items using the callback
  const excludedItems = shouldExclude ? shouldExclude(items) : [];

  // Filter out excluded items
  const availableItems = items.filter((item) => !excludedItems.includes(item));

  if (availableItems.length === 0) {
    return { others: [], picked: null };
  }

  // Get random index
  const randomIndex = Math.floor(Math.random() * availableItems.length);
  const picked = availableItems[randomIndex];

  // Get remaining available items (excluding both picked and excluded items)
  const others = availableItems.filter((item) => item !== picked);

  return {
    picked,
    others,
  };
}

export function getKeysByLowestArray<T>(map: Map<string, T[]>): string[] {
  if (map.size === 0) return [];

  const entries = Array.from(map.entries());
  const lengths = entries.map(([_, value]) => value.length);
  const maxLength = Math.min(...lengths);

  // Check if all lengths are equal
  if (lengths.every((len) => len === lengths[0])) {
    return [];
  }

  return entries
    .filter(([_, value]) => value.length === maxLength)
    .map(([key]) => key);
}
