export function normalizeCountForm (number: number, words_arr: Array<string>) {
  let options = [2, 0, 1, 1, 1, 2];
  return words_arr[(number % 100 > 4 && number % 100 < 20) ? 2 : options[(number % 10 < 5) ? number % 10 : 5]];
}