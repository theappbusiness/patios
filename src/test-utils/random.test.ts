import { getRandomString } from './random'

describe('getRandomString', () => {
  it('randomises randomly', () => {
    // this takes ~580ms
    for (let i = 0; i < 1000; i++) {
      const sample = Array(10)
        .fill(null)
        .map(() => getRandomString())
      const isNotSelfSimilar = sample.every(
        (string, i) => string !== sample[i - 1],
      )
      expect(isNotSelfSimilar).toBe(true)

      const concatenatedSample = sample.reduce((acc, cur) => acc + cur, '')
      expect(concatenatedSample).toMatch(/[A-Z]/)
      expect(concatenatedSample).toMatch(/[a-z]/)
      expect(concatenatedSample).toMatch(/[0-9]/)
    }
  })
})
