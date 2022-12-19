import type { FileSystem } from '../write-bin-template/types'
import { mockify } from './mockify'

// Feel free to fill in mkdirSync and rmSync if you think of something sensible
// eslint-disable-next-line @typescript-eslint/no-empty-function
const mkdirSync = (): void => {}
// eslint-disable-next-line @typescript-eslint/no-empty-function
const rmSync = (): void => {}

const readFileSync = (): Buffer => {
  return Buffer.from('Hello Files!')
}

const statSync = (dir: string): { isDirectory: () => boolean } => {
  switch (dir) {
    case '/home':
      return { isDirectory: () => true }
    case '/home/new_folder':
      return { isDirectory: () => false }
    default:
      return { isDirectory: () => false }
  }
}

const readdirSync = (dir: string): string[] => {
  switch (dir) {
    case '/home':
      return ['/a', '/b']
    case '/home/a':
      return ['/index.ts']
    case '/home/b':
      return ['/c']
    case '/home/b/c':
      return ['/deepA.mpg', '/deepB.jpeg']
    default:
      return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const writeFileSync = (_path: string, _data: string): void => {}

export const makeMockFileSystem = (
  overrides?: Partial<FileSystem>,
): FileSystem => {
  const fileSystem: FileSystem = mockify({
    mkdirSync,
    readdirSync,
    readFileSync,
    rmSync,
    statSync,
    writeFileSync,
    ...overrides,
  })

  return fileSystem
}
