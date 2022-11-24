import { getRandomString, randomiseCase } from './random'

describe('randomiseCase', () => {
  const longHumanString =
    "A string long enough that there's a statistically insignificant chance that none of the letters are changed"

  it('randomises randomly', () => {
    expect(randomiseCase(randomiseCase(longHumanString))).not.toEqual(
      randomiseCase(longHumanString),
    )
  })

  it('makes some letters uppercase', () => {
    expect(randomiseCase(longHumanString.toLowerCase())).toMatch(/[A-Z]/)
  })
})

describe('getRandomString', () => {
  it('randomises randomly', () => {
    expect(getRandomString()).not.toEqual(getRandomString())
  })

  it('contains uppercase letters', () => {
    expect(getRandomString()).toMatch(/[A-Z]/)
  })

  it('contains lowercase letters', () => {
    expect(getRandomString()).toMatch(/[a-z]/)
  })

  it('contains numbers', () => {
    expect(getRandomString()).toMatch(/[0-9]/)
  })
})
