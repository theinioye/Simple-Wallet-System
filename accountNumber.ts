

export function generateAcccountNumber(
  min: number = 1000000000,
  max: 9999999999
): number {
  const accountNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return accountNumber;
}

