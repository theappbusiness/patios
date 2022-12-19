import type { FileSystem, Path } from '../../types/node-stub.d'
import { makeDirectorySafelyFactory } from './make-directory-safely'
import { getTemplateFileStringsFactory } from './get-template-file-strings'
import { getBinTargetPathsFactory } from './get-bin-target-paths'

export type WriteFilesToBin = (jsonPath: string) => void

export const writeFileToBinFactory = (
  fileSystem: FileSystem,
  path: Path,
  {
    sourcePathFragment,
    targetPathFragment,
  }: {
    sourcePathFragment: string
    targetPathFragment: string
  },
): WriteFilesToBin => {
  const getBinTargetPaths = getBinTargetPathsFactory({
    sourcePathFragment,
    targetPathFragment,
  })

  return (jsonPath: string): void => {
    const { jsonFileStr, yamlFileStr } =
      getTemplateFileStringsFactory(fileSystem)(jsonPath)
    const { jsonBinPath, yamlBinPath } = getBinTargetPaths(jsonPath)
    const makeDirectory = makeDirectorySafelyFactory(fileSystem)
    makeDirectory(path.dirname(jsonBinPath))
    makeDirectory(path.dirname(yamlBinPath))
    fileSystem.writeFileSync(jsonBinPath, jsonFileStr)
    fileSystem.writeFileSync(yamlBinPath, yamlFileStr)
  }
}
