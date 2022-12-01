import * as nodefs from 'fs'
import * as nodepath from 'path'
import { walkFactory } from './walk'
import { makeDirectorySafelyFactory } from './make-directory-safely'
import { FileSystem, Path } from './types'
import { writeFileToBinFactory } from './write-file-to-bin'

const spool = (
  fileSystem: FileSystem,
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
  makeDirectorySafelyFactory(fileSystem)(relativeTargetPath, {
    shouldEmpty: true,
  })
  walkFactory(
    fileSystem,
    path,
  )(path.join(relativeSourcePath, '/json')).forEach(
    writeFileToBinFactory(fileSystem, path, {
      sourcePathFragment,
      targetPathFragment,
    }),
  )
}

const sourcePathFragment = '/templates'
const targetPathFragment = '/bin/templates'

const relativeSourcePath = '.' + sourcePathFragment
const relativeTargetPath = '.' + targetPathFragment
spool(nodefs, nodepath, {
  sourcePathFragment,
  targetPathFragment,
  relativeSourcePath,
  relativeTargetPath,
})
