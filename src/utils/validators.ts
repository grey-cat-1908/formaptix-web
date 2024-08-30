export function validateTIN(value: String) {
  const len = value.length
  if (len !== 10 && len !== 12) return false

  const digits = value.split('').map(Number)

  if (len === 10) {
    const checksum =
      ((2 * digits[0] +
        4 * digits[1] +
        10 * digits[2] +
        3 * digits[3] +
        5 * digits[4] +
        9 * digits[5] +
        4 * digits[6] +
        6 * digits[7] +
        8 * digits[8]) %
        11) %
      10
    return digits[9] === checksum
  }

  if (len === 12) {
    const checksum1 =
      ((7 * digits[0] +
        2 * digits[1] +
        4 * digits[2] +
        10 * digits[3] +
        3 * digits[4] +
        5 * digits[5] +
        9 * digits[6] +
        4 * digits[7] +
        6 * digits[8] +
        8 * digits[9]) %
        11) %
      10
    const checksum2 =
      ((3 * digits[0] +
        7 * digits[1] +
        2 * digits[2] +
        4 * digits[3] +
        10 * digits[4] +
        3 * digits[5] +
        5 * digits[6] +
        9 * digits[7] +
        4 * digits[8] +
        6 * digits[9] +
        8 * digits[10]) %
        11) %
      10
    return digits[10] === checksum1 && digits[11] === checksum2
  }

  return false
}

export function validateSNILS(value: String) {
  if (value.length !== 11) return false

  const digits = value.slice(0, 9).split('').map(Number)
  const checksum = digits.reduce((sum, digit, index) => sum + digit * (9 - index), 0)

  let controlNumber = checksum % 101
  if (controlNumber === 100 || controlNumber === 101) {
    controlNumber = 0
  }

  return controlNumber === Number(value.slice(-2))
}
