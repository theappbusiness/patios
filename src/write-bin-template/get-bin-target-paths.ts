export type GetBinTargetPaths = (jsonPath: string) => {
  jsonBinPath: string
  yamlBinPath: string
}

export const getBinTargetPathsFactory =
  ({
    sourcePathFragment,
    targetPathFragment,
  }: {
    sourcePathFragment: string
    targetPathFragment: string
  }): GetBinTargetPaths =>
  (jsonPath: string): { jsonBinPath: string; yamlBinPath: string } => {
    const jsonBinPath = jsonPath.replace(sourcePathFragment, targetPathFragment)
    const yamlBinPath = jsonBinPath.replaceAll('json', 'yaml')
    return {
      jsonBinPath,
      yamlBinPath,
    }
  }
