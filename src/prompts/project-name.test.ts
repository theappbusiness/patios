import { getRandomString } from '../test-utils/random'
import { getProjectNamePrompt } from './project-name'

describe('getProjectNamePrompt', () => {
  describe('initial value', () => {
    it('matches the given process directory', () => {
      const randomString = getRandomString()
      const projectNamePrompt = getProjectNamePrompt(randomString)
      expect(projectNamePrompt.initial).toBe(randomString)
    })
  })

  describe('validation', () => {
    it('permits alphanumeric names', () => {
      const projectNamePrompt = getProjectNamePrompt('.')
      const randomString = getRandomString()
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
