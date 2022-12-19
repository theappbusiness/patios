import { Path } from '../../types/node-stub.d'
import { mockify } from './mockify'

const dirname = (path: string): string => {
  const fileName = path.match(/.[a-z]{2,4}$/i)
  if (fileName && fileName.index) {
    return path.slice(0, fileName.index - 1)
  } else {
    return path
  }
}

const join = (...paths: string[]): string => {
  return paths.join('/')
}

const resolve = (dir: string, file: string): string => {
  return dir + file
}

export const makeMockPath = (overrides?: Partial<Path>): Path => {
  const path: Path = mockify({
    dirname,
    join,
    resolve,
    ...overrides,
  })

  return path
}
