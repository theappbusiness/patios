import * as fs from 'fs'
import { extname, join as joinPath, resolve } from 'path'
import type { OpenAPIV3 } from 'openapi-types'
import type { JsonObject, SetRequired } from 'type-fest'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import {
  entryFile,
  outputDirectory,
  outputFileName,
  rootSpecDirectory,
} from '../bundle-config.json'

enum FileExtension {
  JSON = '.json',
  YAML = '.yaml',
}

enum ContentType {
  Attributes = 'attributes',
  Parameters = 'parameters',
  Responses = 'responses',
  Schemas = 'schemas',
  Examples = 'examples',
}

type ComponentsObject = SetRequired<
  OpenAPIV3.ComponentsObject,
  'schemas' | 'responses' | 'parameters' | 'examples'
>
interface OpenApiDocument extends OpenAPIV3.Document {
  components: ComponentsObject
}

const resolveToRoot = (path: string): string => resolve(rootSpecDirectory, path)

const listFilesByFormat =
  (format: FileExtension) =>
  (path: string): string[] =>
    fs.readdirSync(path).filter((file) => extname(file) === format)

const listJsonFiles = listFilesByFormat(FileExtension.JSON)
//const listYamlFiles = listFilesByFormat(FileExtension.YAML)

const readJsonFile = (path: string): JsonObject =>
  JSON.parse(fs.readFileSync(resolveToRoot(path)).toString())

const getComponentName = (fileName: string, isAttribute: boolean): string => {
  const withoutExtension = fileName.replace(FileExtension.JSON, '')
  if (isAttribute) {
    // Avoid potential clashes names in the schema space
    return `${withoutExtension}Attribute`
  }
  return withoutExtension
}

const rewritePathToSchemas = (path: string): string =>
  path.replace(ContentType.Attributes, ContentType.Schemas)

const rewritePaths = <T>(obj: T, type: ContentType): T => {
  // Paths to other JSON files
  const pattern = new RegExp(
    //'".{1,2}(?:/([a-z]+))?/([a-z0-9-_]*).json(#[a-z0-9/]+)?"',
    '".{1,2}(?:/([a-z]+))?/([a-z0-9-_]*).(?:json|yaml)(#[a-z0-9/]+)?"',
    'gi',
  )

  let content = JSON.stringify(obj, null, 2)

  const replacements = content
    .match(pattern)
    ?.reduce<Record<string, string>>((acc, ref) => {
      pattern.lastIndex = 0 // Reset internal RegEx state - https://stackoverflow.com/a/11477448

      const matches = pattern.exec(ref)

      if (!Array.isArray(matches) || matches?.length < 3) {
        throw new Error(
          `Directory and filename could not be determined from ${ref}`,
        )
      }

      const [_, directory, fileName] = matches

      const path = directory || type
      const values = {
        path: rewritePathToSchemas(path),
        name: getComponentName(fileName, path.includes(ContentType.Attributes)),
      }

      return {
        ...acc,
        [ref]: `"#/components/${values.path}/${values.name}"`,
      }
    }, {})

  if (replacements) {
    Object.entries(replacements).forEach(([original, replacement]) => {
      content = content.replaceAll(original, replacement)
    })
  }

  return JSON.parse(content)
}

const readComponents = (spec: OpenApiDocument, type: ContentType): void => {
  const isAttribute = type === ContentType.Attributes
  const componentType = isAttribute ? ContentType.Schemas : type
  const directory = `./${type}`

  listJsonFiles(resolveToRoot(directory)).forEach((fileName) => {
    const componentName = getComponentName(fileName, isAttribute)

    spec.components[componentType][componentName] = rewritePaths(
      readJsonFile(`${directory}/${fileName}`),
      type,
    )
  })
}

const readRootDocument = (entry: string): OpenApiDocument => {
  const spec: OpenAPIV3.Document = readJsonFile(
    entry,
  ) as unknown as OpenAPIV3.Document

  return {
    ...spec,
    components: {
      schemas: {},
      responses: {},
      parameters: {},
      examples: {},
    },
  }
}

const bundleSpec = ({
  entry,
  outputDirectory,
  outputFileName,
}: {
  entry: string
  outputDirectory: string
  outputFileName: string
}): void => {
  // Set the initial structure
  const spec: OpenApiDocument = readRootDocument(entry)

  // Load the routes
  Object.entries(spec.paths).forEach(([uri, endpoint]) => {
    const body = endpoint?.$ref
      ? rewritePaths(readJsonFile(endpoint.$ref), ContentType.Responses)
      : endpoint
    spec.paths[uri] = body
  })

  // Load elements which are OpenAPI components
  ;[
    ContentType.Parameters,
    ContentType.Responses,
    ContentType.Schemas,
    ContentType.Attributes,
    ContentType.Examples,
  ].forEach((type) => {
    readComponents(spec, type)
  })

  // Write the file to the appropriate directory
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true })
  }
  fs.writeFileSync(
    joinPath(outputDirectory, outputFileName),
    JSON.stringify(spec, null, 2),
  )
}

const argv = await yargs(hideBin(process.argv)).argv

const outputDir =
  (typeof argv.outputDir === 'string' && argv.outputDir) || outputDirectory
if (argv.clean) {
  fs.rmSync(outputDir, { recursive: true, force: true })
}

bundleSpec({
  entry: (typeof argv.entryFile === 'string' && argv.entryFile) || entryFile,
  outputDirectory: outputDir,
  outputFileName:
    (typeof argv.outputFile === 'string' && argv.outputFile) || outputFileName,
})
