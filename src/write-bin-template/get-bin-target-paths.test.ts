import { getRandomString } from '../test-utils/random'
import { getBinTargetPathsFactory } from './get-bin-target-paths'

describe('getBinTargetPath', () => {
  it('Makes target paths for JSON and YAML templates', () => {
    const sourcePathFragment = `/${getRandomString()}/${getRandomString()}/`
    const targetPathFragment = `/${getRandomString()}/${getRandomString()}/`
    const precedingPath = `../../${getRandomString()}/`
    const fileName = `${getRandomString()}`

    const { jsonBinPath, yamlBinPath } = getBinTargetPathsFactory({
      sourcePathFragment,
      targetPathFragment,
    })(`${precedingPath}${sourcePathFragment}${fileName}.json`)
    expect(jsonBinPath).toBe(
      `${precedingPath}${targetPathFragment}${fileName}.json`,
    )
    expect(yamlBinPath).toBe(
      `${precedingPath}${targetPathFragment}${fileName}.yaml`,
    )
  })
})
