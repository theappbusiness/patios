import type { FileSystem, Path } from '../../types/node-stub.d'
import { makeDirectorySafelyFactory } from './make-directory-safely'
import { getTemplateFileStringsFactory } from './get-template-file-strings'
import { getBinTargetPathsFactory } from './get-bin-target-paths'
import type { SourceAndTargetDirectories } from './get-bin-target-paths'

export type WriteFilesToBin = (jsonPath: string) => void

export const writeFileToBinFactory = (
  fileSystem: FileSystem,
  path: Path,
  sourceAndTargetDirs: SourceAndTargetDirectories,
): WriteFilesToBin => {
  const getBinTargetPaths = getBinTargetPathsFactory(sourceAndTargetDirs)
  const templateStringFactory = getTemplateFileStringsFactory(fileSystem)
  const makeDirectory = makeDirectorySafelyFactory(fileSystem)

  return (jsonPath: string): void => {
    const { jsonFileStr, yamlFileStr } = templateStringFactory(jsonPath)
    const { jsonBinPath, yamlBinPath } = getBinTargetPaths(jsonPath)
    new Map([
      [jsonBinPath, jsonFileStr],
      [yamlBinPath, yamlFileStr],
    ]).forEach((fileContent, binPath) => {
      makeDirectory(path.dirname(binPath))
      fileSystem.writeFileSync(binPath, fileContent)
    })
  }
}
