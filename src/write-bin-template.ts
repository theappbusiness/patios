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

const makeBinTemplateDirectory = (): void => {
  const binTemplatesStat = fs.statSync('./bin/templates', {
    throwIfNoEntry: false,
  })
  if (binTemplatesStat) {
    fs.rmSync('./bin/templates', { recursive: true })
  }
  fs.mkdirSync('./bin/templates')
}

const getBinTargetPaths = (
  jsonPath: string,
): { jsonBinPath: string; yamlBinPath: string } => {
  const jsonBinPath = jsonPath.replace('/templates/', '/bin/templates/')
  const yamlBinPath = jsonBinPath.replaceAll('json', 'yaml')
  return {
    jsonBinPath,
    yamlBinPath,
  }
}

const makeBinTemplateSubdirectory = (jsonPath: string): void => {
  const { jsonBinPath, yamlBinPath } = getBinTargetPaths(jsonPath)
  const jsonDirname = path.dirname(jsonBinPath)
  const yamlDirname = path.dirname(yamlBinPath)
  const jsonStat = fs.statSync(jsonDirname, { throwIfNoEntry: false })
  const yamlStat = fs.statSync(yamlDirname, { throwIfNoEntry: false })
  if (!jsonStat?.isDirectory()) {
    fs.mkdirSync(jsonDirname)
  }
  if (!yamlStat?.isDirectory()) {
    fs.mkdirSync(yamlDirname)
  }
}

const getTemplateStrings = (
  jsonPath: string,
): { jsonStr: string; yamlStr: string } => {
  const rawTemplate = fs.readFileSync(jsonPath).toString()
  const jsonStr = rawTemplate.replaceAll('$EXT', 'json')
  const yamlStr = stringify(JSON.parse(rawTemplate.replaceAll('$EXT', 'yaml')))
  return {
    jsonStr,
    yamlStr,
  }
}

const writeTemplateFileToBin = (jsonPath: string): void => {
  makeBinTemplateSubdirectory(jsonPath)
  const { jsonStr, yamlStr } = getTemplateStrings(jsonPath)
  const { jsonBinPath, yamlBinPath } = getBinTargetPaths(jsonPath)
  fs.writeFileSync(jsonBinPath, jsonStr)
  fs.writeFileSync(yamlBinPath, yamlStr)
}

;((): void => {
  makeBinTemplateDirectory()
  walk('./templates/json').forEach((jsonPath) => {
    writeTemplateFileToBin(jsonPath)
  })
})()
