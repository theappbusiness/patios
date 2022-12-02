import * as fs from 'fs'
import * as path from 'path'
import { walkFactory } from './walk'
import { makeDirectorySafelyFactory } from './make-directory-safely'
import { FileSystem, Path } from './types'
import { writeFileToBinFactory } from './write-file-to-bin'
;((
  fs: FileSystem,
  path: Path,
  {
    sourcePathFragment,
    targetPathFragment,
    relativeSourcePath,
    relativeTargetPath,
  }: {
    sourcePathFragment: string
    targetPathFragment: string
    relativeSourcePath: string
    relativeTargetPath: string
  },
): void => {
  makeDirectorySafelyFactory(fs)(relativeTargetPath, {
    shouldEmpty: true,
  })
  walkFactory(
    fs,
    path,
  )(relativeSourcePath).forEach(
    writeFileToBinFactory(fs, path, {
      sourcePathFragment,
      targetPathFragment,
    }),
  )
})(fs, path, {
  sourcePathFragment: '/templates',
  targetPathFragment: '/bin/templates',
  relativeSourcePath: './templates/json',
  relativeTargetPath: './bin/templates',
})
