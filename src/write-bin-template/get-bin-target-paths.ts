export type SourceAndTargetDirectories = {
  sourcePathFragment: string
  targetPathFragment: string
}

export type BinTargetPaths = {
  jsonBinPath: string
  yamlBinPath: string
}

export const getBinTargetPathsFactory =
  ({
    sourcePathFragment,
    targetPathFragment,
  }: SourceAndTargetDirectories): ((jsonPath: string) => BinTargetPaths) =>
  (jsonPath: string): BinTargetPaths => {
    const jsonBinPath = jsonPath.replace(sourcePathFragment, targetPathFragment)
    const yamlBinPath = jsonBinPath.replaceAll('json', 'yaml')
    return {
      jsonBinPath,
      yamlBinPath,
    }
  }
