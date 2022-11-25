import * as fs from 'fs'
import * as path from 'path'
import { stringify } from 'json-to-pretty-yaml'

const walk = (dir: string, prevResults?: string[]): string[] => {
  const list = fs.readdirSync(dir)
  const results = prevResults || []
  list.forEach((file) => {
    file = path.resolve(dir, file)
    const stat = fs.statSync(file)
    if (stat.isDirectory()) {
      walk(file, results)
    } else {
      results.push(file)
    }
  })
  return results
}

;((): void => {
  const binTemplatesStat = fs.statSync('./bin/templates')
  if (binTemplatesStat.isDirectory()) {
    fs.rmSync('./bin/templates', { recursive: true })
  }
  fs.mkdirSync('./bin/templates')
  const jsonPaths = walk('./templates/json')
  jsonPaths.forEach((jsonPath) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const json = require(jsonPath)
    const data = stringify(json)
    const binJsonTemplatesPath = jsonPath.replace(
      '/templates/',
      '/bin/templates/',
    )
    const binYamlTemplatesPath = binJsonTemplatesPath.replaceAll('json', 'yaml')
    const jsonDirname = path.dirname(binJsonTemplatesPath)
    const yamlDirname = path.dirname(binYamlTemplatesPath)
    const jsonStat = fs.statSync(jsonDirname, { throwIfNoEntry: false })
    const yamlStat = fs.statSync(jsonDirname, { throwIfNoEntry: false })
    if (!jsonStat?.isDirectory()) {
      fs.mkdirSync(jsonDirname)
    }
    if (!yamlStat?.isDirectory()) {
      fs.mkdirSync(yamlDirname)
    }
    fs.writeFileSync(binJsonTemplatesPath, data)
    fs.writeFileSync(binYamlTemplatesPath, data)
  })
})()
