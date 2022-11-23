import { getEntryPointPrompt, getProjectNamePrompt } from './wizard'

describe('getProjectNamePrompt', () => {
  describe('initial value', () => {
    it('matches the given process directory', () => {
      const randomString = Math.random().toString(36).substring(2)
      const projectNamePrompt = getProjectNamePrompt(randomString)
      expect(projectNamePrompt.initial).toBe(randomString)
    })
  })

  describe('validation', () => {
    it('permits alphanumeric names', () => {
      const projectNamePrompt = getProjectNamePrompt('.')
      const randomString = Math.random().toString(36).substring(2)
      expect(
        projectNamePrompt.validate?.(randomString, [], projectNamePrompt),
      ).toBe(true)
    })

    it('permits names with hyphens', () => {
      const projectNamePrompt = getProjectNamePrompt('.')
      expect(
        projectNamePrompt.validate?.('file-name', [], projectNamePrompt),
      ).toBe(true)
    })

    it('permits names with underscores', () => {
      const projectNamePrompt = getProjectNamePrompt('.')
      expect(
        projectNamePrompt.validate?.('file_name', [], projectNamePrompt),
      ).toBe(true)
    })

    it.each(['.', '"', "'", '#', '/', '\\', '|'])(
      'does not permit names with %s',
      (char) => {
        const projectNamePrompt = getProjectNamePrompt('.')
        expect(
          projectNamePrompt.validate?.(
            `file${char}name`,
            [],
            projectNamePrompt,
          ),
        ).toMatch(
          /Project name may only contain letters, numbers, hyphens and underscores/,
        )
      },
    )
  })
})

describe('getEntryPointPrompt', () => {
  describe('initial value', () => {
    it('matches the given document syntax', () => {
      const randomString = Math.random().toString(36).substring(2)
      const entryPointPrompt = getEntryPointPrompt(randomString)
      expect(entryPointPrompt.initial).toBe(`openapi.${randomString}`)
    })
  })

  describe('validation', () => {
    it('permits alphanumeric names', () => {
      const entryPointPrompt = getEntryPointPrompt('json')
      const randomString = Math.random().toString(36).substring(2)
      expect(
        entryPointPrompt.validate?.(randomString, [], entryPointPrompt),
      ).toBe(true)
    })

    it('permits names containing .', () => {
      const entryPointPrompt = getEntryPointPrompt('json')
      const randomStringA = Math.random().toString(36).substring(2)
      const randomStringB = Math.random().toString(36).substring(2)
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
        const randomStringA = Math.random().toString(36).substring(2)
        const randomStringB = Math.random().toString(36).substring(2)
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
        const randomStringA = Math.random().toString(36).substring(2)
        const randomStringB = Math.random().toString(36).substring(2)
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
      const randomStringA = Math.random().toString(36).substring(2)
      const randomStringB = Math.random().toString(36).substring(2)
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
        const randomStringA = Math.random().toString(36).substring(2)
        const randomStringB = Math.random().toString(36).substring(2)
        const filename = `${randomStringA}.${randomStringB}.${syntax}`
        expect(entryPointPrompt.format?.(filename, [], entryPointPrompt)).toBe(
          filename,
        )
      },
    )

    it.each(['json', 'yaml'])('appends the given document syntax', (syntax) => {
      const entryPointPrompt = getEntryPointPrompt(syntax)
      const randomStringA = Math.random().toString(36).substring(2)
      const randomStringB = Math.random().toString(36).substring(2)
      const filename = `${randomStringA}.${randomStringB}`
      expect(entryPointPrompt.format?.(filename, [], entryPointPrompt)).toBe(
        `${filename}.${syntax}`,
      )
    })
  })
})
