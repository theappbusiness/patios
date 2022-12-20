import { makeMockFileSystem } from '../test-utils/mock-file-system'
import { getRandomString } from '../test-utils/random'
import { makeDirectorySafelyFactory } from './make-directory-safely'

describe('makeDirectorySafely', () => {
  describe('Given a path to a directory that already exists', () => {
    it('Does nothing', () => {
      const mockFileSystem = makeMockFileSystem()
      const makeDirectorySafely = makeDirectorySafelyFactory(mockFileSystem)

      makeDirectorySafely('/home')

      expect(mockFileSystem.rmSync).not.toHaveBeenCalled()
      expect(mockFileSystem.mkdirSync).not.toHaveBeenCalled()
    })

    it('Removes the directory and remakes it if shouldEmpty is set', () => {
      const mockFileSystem = makeMockFileSystem()
      const makeDirectorySafely = makeDirectorySafelyFactory(mockFileSystem)

      makeDirectorySafely('/home', { shouldEmpty: true })

      expect(mockFileSystem.rmSync).toHaveBeenCalledWith('/home', {
        recursive: true,
      })
      expect(mockFileSystem.mkdirSync).toHaveBeenCalledWith('/home')
    })
  })

  describe('given a path to a directory that does not exist', () => {
    it('Makes the directory', () => {
      const mockFileSystem = makeMockFileSystem()
      const makeDirectorySafely = makeDirectorySafelyFactory(mockFileSystem)

      const newDirName = `/${getRandomString()}`
      makeDirectorySafely(newDirName)

      expect(mockFileSystem.rmSync).not.toHaveBeenCalled()
      expect(mockFileSystem.mkdirSync).toHaveBeenCalledWith(newDirName)
    })
  })
})
