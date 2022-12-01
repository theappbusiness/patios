import { stringify } from 'json-to-pretty-yaml'
import { FileSystem } from './types'

export type GetTemplateFileStrings = (jsonPath: string) => {
  jsonFileStr: string
  yamlFileStr: string
}

export const getTemplateFileStringsFactory =
  ({ readFileSync }: FileSystem) =>
  (jsonPath: string): { jsonFileStr: string; yamlFileStr: string } => {
    const rawTemplate = readFileSync(jsonPath).toString()
    const jsonFileStr = rawTemplate.replaceAll('$EXT', 'json')
    const yamlFileStr = stringify(
      JSON.parse(rawTemplate.replaceAll('$EXT', 'yaml')),
    )
    return {
      jsonFileStr,
      yamlFileStr,
    }
  }
