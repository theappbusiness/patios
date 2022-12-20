export type SourceAndTargetDirectories = {
  sourcePathFragment: string
  targetPathFragment: string
}

export type BinTargetPaths = (jsonPath: string) => {
  jsonBinPath: string
  yamlBinPath: string
}

export const getBinTargetPathsFactory =
  ({
    sourcePathFragment,
    targetPathFragment,
  }: SourceAndTargetDirectories): BinTargetPaths =>
  (jsonPath: string): { jsonBinPath: string; yamlBinPath: string } => {
    const jsonBinPath = jsonPath.replace(sourcePathFragment, targetPathFragment)
    const yamlBinPath = jsonBinPath.replaceAll('json', 'yaml')
    return {
      jsonBinPath,
      yamlBinPath,
    }
  }
