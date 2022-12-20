import { getRandomString } from '../test-utils/random'
import { getEntryPointPrompt } from './entry-point'

describe('getEntryPointPrompt', () => {
  describe('initial value', () => {
    it('matches the given document syntax', () => {
      const randomString = getRandomString()
      const entryPointPrompt = getEntryPointPrompt(randomString)
      expect(entryPointPrompt.initial).toBe(`openapi.${randomString}`)
    })
  })

  describe('validation', () => {
    it('permits alphanumeric names', () => {
      const entryPointPrompt = getEntryPointPrompt('json')
      const randomString = getRandomString()
      expect(
        entryPointPrompt.validate?.(randomString, [], entryPointPrompt),
      ).toBe(true)
    })

    it('permits names containing .', () => {
      const entryPointPrompt = getEntryPointPrompt('json')
      const randomStringA = getRandomString()
      const randomStringB = getRandomString()
      expect(
        entryPointPrompt.validate?.(
          `${randomStringA}.${randomStringB}`,
          [],
          entryPointPrompt,
        ),
      ).toBe(true)
    })

    it.each(['json', 'yaml'])(
      'permits names ending in the given document syntax (%s)',
      (syntax) => {
        const entryPointPrompt = getEntryPointPrompt(syntax)
        const randomStringA = getRandomString()
        const randomStringB = getRandomString()
        expect(
          entryPointPrompt.validate?.(
            `${randomStringA}.${randomStringB}.${syntax}`,
            [],
            entryPointPrompt,
          ),
        ).toBe(true)
      },
    )

    it.each([
      ['json', 'yaml'],
      ['yaml', 'json'],
    ])(
      'does not permit names ending in the opposing document syntax (given %s reject %s)',
      (syntaxA, syntaxB) => {
        const entryPointPrompt = getEntryPointPrompt(syntaxA)
        const randomStringA = getRandomString()
        const randomStringB = getRandomString()
        expect(
          entryPointPrompt.validate?.(
            `${randomStringA}.${randomStringB}.${syntaxB}`,
            [],
            entryPointPrompt,
          ),
        ).toMatch(/Entry point extension must match chosen document syntax/)
      },
    )

    it('does not permit names ending in .', () => {
      const entryPointPrompt = getEntryPointPrompt('yaml')
      const randomStringA = getRandomString()
      const randomStringB = getRandomString()
      expect(
        entryPointPrompt.validate?.(
          `${randomStringA}.${randomStringB}.`,
          [],
          entryPointPrompt,
        ),
      ).toMatch(/Entry point extension must match chosen document syntax/)
    })
  })

  describe('formatter', () => {
    it.each(['json', 'yaml'])(
      'leaves names ending in %s unchanged',
      (syntax) => {
        const entryPointPrompt = getEntryPointPrompt(syntax)
        const randomStringA = getRandomString()
        const randomStringB = getRandomString()
        const filename = `${randomStringA}.${randomStringB}.${syntax}`
        expect(entryPointPrompt.format?.(filename, [], entryPointPrompt)).toBe(
          filename,
        )
      },
    )

    it.each(['json', 'yaml'])('appends the given document syntax', (syntax) => {
      const entryPointPrompt = getEntryPointPrompt(syntax)
      const randomStringA = getRandomString()
      const randomStringB = getRandomString()
      const filename = `${randomStringA}.${randomStringB}`
      expect(entryPointPrompt.format?.(filename, [], entryPointPrompt)).toBe(
        `${filename}.${syntax}`,
      )
    })
  })
})
