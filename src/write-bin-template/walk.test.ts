import { makeMockFileSystem } from '../test-utils/mock-file-system'
import { makeMockPath } from '../test-utils/mock-path'
import { walkFactory } from './walk'

export const statSync = (dir: string): { isDirectory: () => boolean } => {
  return {
    isDirectory: (): boolean => {
      return !dir.match(/\.[a-z]{2,4}$/)
    },
  }
}

describe('walk', () => {
  const walk = walkFactory(makeMockFileSystem({ statSync }), makeMockPath())

  it("Returns a list of paths to all files within a directory and it's subdirectories", () => {
    const files = walk('/home')
    expect(files).toEqual([
      '/home/a/index.ts',
      '/home/b/c/deepA.mpg',
      '/home/b/c/deepB.jpeg',
    ])
  })
})
