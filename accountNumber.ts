

export function generateAcccountNumber()
: number {
    const min = 9999999999
    const max = 1000000000
  const accountNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return accountNumber;
}

