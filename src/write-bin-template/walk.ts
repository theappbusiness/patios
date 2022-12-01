import { FileSystem, Path } from './types'

export type Walk = (dir: string, prevResults?: string[] | undefined) => string[]

export const walkFactory = (
  { statSync, readdirSync }: FileSystem,
  { resolve }: Path,
): Walk => {
  const walk = (dir: string, prevResults?: string[]): string[] => {
    const list = readdirSync(dir)
    const results = prevResults || []
    list.forEach((file) => {
      file = resolve(dir, file)
      const stat = statSync(file)
      if (stat.isDirectory()) {
        walk(file, results)
      } else {
        results.push(file)
      }
    })
    return results
  }
  return walk
}
