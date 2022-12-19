export interface FileSystem {
  mkdirSync: (dir: string) => void
  statSync: (
    dir: string,
    opts?: { throwIfNoEntry?: boolean },
  ) => { isDirectory: () => boolean }
  readdirSync: (dir: string) => string[]
  readFileSync: (path: string) => Buffer
  rmSync: (dir: string, opts: { recursive?: boolean }) => void
  writeFileSync: (path: string, data: string) => void
}

export interface Path {
  dirname: (path: string) => string
  join: (...paths: string[]) => string
  resolve: (dir: string, file: string) => string
}
