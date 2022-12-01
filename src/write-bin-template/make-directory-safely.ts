import { FileSystem } from './types'

export type MakeDirectorySafely = (
  path: string,
  options?: { shouldEmpty: boolean },
) => void

export const makeDirectorySafelyFactory =
  ({ mkdirSync, rmSync, statSync }: FileSystem): MakeDirectorySafely =>
  (path: string, { shouldEmpty } = { shouldEmpty: false }): void => {
    const stat = statSync(path, {
      throwIfNoEntry: false,
    })
    if (stat?.isDirectory() && !shouldEmpty) {
      return
    } else if (stat?.isDirectory() && shouldEmpty) {
      rmSync(path, { recursive: true })
    }
    mkdirSync(path)
  }
