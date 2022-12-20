import { cpSync, mkdirSync, renameSync } from 'fs'
import { join as joinPath } from 'path'
import type { ProjectOptions } from './wizard'

export const makeBoilerplate = (
  processDirectory: string,
  { documentSyntax, entryPoint, projectName }: ProjectOptions,
): void => {
  const templateDirectory = joinPath(__dirname, './templates/', documentSyntax)
  let writeDirectory = '.'

  if (processDirectory !== projectName) {
    // TODO: add a nice error message for if this dir already exists
    mkdirSync(projectName)
    writeDirectory = joinPath(writeDirectory, projectName)
  }

  writeDirectory = joinPath(writeDirectory, 'src')
  mkdirSync(writeDirectory)

  cpSync(templateDirectory, writeDirectory, { recursive: true })
  renameSync(
    joinPath(writeDirectory, `[entryPoint].${documentSyntax}`),
    joinPath(writeDirectory, entryPoint),
  )
}
