import { makeMockFileSystem } from '../test-utils/mock-file-system'
import { makeMockPath } from '../test-utils/mock-path'
import { getRandomString } from '../test-utils/random'
import {
  GetTemplateFileStrings,
  getTemplateFileStringsFactory,
} from './get-template-file-strings'
import { writeFileToBinFactory } from './write-file-to-bin'

jest.mock('./get-template-file-strings', () => ({
  getTemplateFileStringsFactory: jest.fn(),
}))

const mockGetTemplateFileStringsFactory =
  getTemplateFileStringsFactory as jest.Mock

const jsonFileStr = getRandomString()
const yamlFileStr = getRandomString()

mockGetTemplateFileStringsFactory.mockImplementation(
  (): GetTemplateFileStrings => () => ({
    jsonFileStr,
    yamlFileStr,
  }),
)

describe('writeFileToBin', () => {
  it('Writes the template files to the target path', () => {
    const fragsAndPaths = {
      sourcePathFragment: `/${getRandomString()}`,
      targetPathFragment: `/${getRandomString()}/${getRandomString()}`,
    }

    const precedingPath = getRandomString()
    const fileName = getRandomString()

    const inputPath = `/${precedingPath}/${fragsAndPaths.sourcePathFragment}/${fileName}.json`

    const expectedJsonOutputPath = `/${precedingPath}/${fragsAndPaths.targetPathFragment}/${fileName}.json`

    const expectedYamlOutputPath = `/${precedingPath}/${fragsAndPaths.targetPathFragment}/${fileName}.yaml`

    const mockFileSystem = makeMockFileSystem()
    const writeFileToBin = writeFileToBinFactory(
      mockFileSystem,
      makeMockPath(),
      fragsAndPaths,
    )

    writeFileToBin(inputPath)

    expect(mockFileSystem.writeFileSync).toHaveBeenCalledWith(
      expectedJsonOutputPath,
      jsonFileStr,
    )
    expect(mockFileSystem.writeFileSync).toHaveBeenCalledWith(
      expectedYamlOutputPath,
      yamlFileStr,
    )
  })
})
