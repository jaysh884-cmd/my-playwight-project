export function sortStringsAscending(values: string[]): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

export function sortStringsDescending(values: string[]): string[] {
  return [...values].sort((left, right) => right.localeCompare(left));
}

export function sortNumbersAscending(values: number[]): number[] {
  return [...values].sort((left, right) => left - right);
}

export function sortNumbersDescending(values: number[]): number[] {
  return [...values].sort((left, right) => right - left);
}
