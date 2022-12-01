import { makeMockFileSystem } from '../test-utils/mock-file-system'
import { getTemplateFileStringsFactory } from './get-template-file-strings'

const mockFile = {
  'just-a-string': "It's just words",
  'just-a-number': 8,
  an_array: ['someValue', { 'a nested': 'object' }],
  anObject: {
    anotherString: 'words inside an object',
    aReferenceToSomeExternalFile: '../wherever/it/is/referencedFileA.$EXT',
    anArray: [
      {
        some: 'thing',
        anotherReferenceToSomeExternalFile:
          '../wherever/it/is/referencedFileB.$EXT',
      },
    ],
  },
}

describe('getTemplateFileStrings', () => {
  it('Converts a JSON template to stringified JSON and YAML', () => {
    const mockFileSystem = makeMockFileSystem({
      readFileSync() {
        return Buffer.from(JSON.stringify(mockFile))
      },
    })
    const getTemplateFileStrings = getTemplateFileStringsFactory(mockFileSystem)
    const { jsonFileStr, yamlFileStr } = getTemplateFileStrings('/path')
    expect(jsonFileStr).toMatchSnapshot()
    expect(yamlFileStr).toMatchSnapshot()
  })
})
