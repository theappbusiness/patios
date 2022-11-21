import fs from 'fs'
import prompt, { Schema } from 'prompt'

interface ProjectOptions {
  projectName: string
  documentSyntax: string
  entryPoint: string
}

const getFirstQuestionSchema = ({
  processDirectory,
}: {
  processDirectory: string
}): Schema => ({
  properties: {
    projectName: {
      description: 'Project name',
      required: true,
      type: 'string',
      default: processDirectory,
      minLength: 1,
      pattern: /^[\w\-_]+$/,
    },
    documentSyntax: {
      default: 'json',
      description: 'Choose a document syntax, yaml or json',
      message: 'The document syntax must be either yaml or json',
      pattern: /^yaml|json$/i,
      required: true,
      type: 'string',
      before: (input) => input.toLowerCase(),
    },
  },
})

const getSecondQuestionSchema = ({
  documentSyntax,
}: {
  documentSyntax: string
}): Schema => ({
  properties: {
    entryPoint: {
      default: `openapi.${documentSyntax}`,
      description: 'Entry point',
      message: `Entry point extension must match chosen document syntax (you chose ${documentSyntax})`,
      pattern: new RegExp(
        `(.*)(?<!\\.|${documentSyntax === 'json' ? 'yaml' : 'json'})$`,
      ),
      required: true,
      type: 'string',
      before: (input): string => {
        if (input.match(/(\.json|\.yaml)$/)) {
          return input
        }
        return `${input}.${documentSyntax}`
      },
    },
  },
})

export const getProjectOptions = async (
  processDirectory: string,
): Promise<ProjectOptions> => {
  const { documentSyntax, projectName } = await prompt.get(
    getFirstQuestionSchema({ processDirectory }),
  )

  const { entryPoint } = await prompt.get(
    getSecondQuestionSchema({ documentSyntax: documentSyntax as string }),
  )

  return {
    documentSyntax,
    entryPoint,
    projectName,
  } as ProjectOptions
}

export const makeBoilerplate = (
  processDirectory: string,
  { entryPoint, projectName }: ProjectOptions,
): void => {
  let writeDirectory = processDirectory
  if (processDirectory !== projectName) {
    fs.mkdirSync(`${processDirectory}/${projectName}` as string)
    writeDirectory += `/${projectName}`
  }
  fs.writeFileSync(`${writeDirectory}/${entryPoint}`, 'Hello Spec!')
}

export const init = async (): Promise<void> => {
  const processDirectory = process.argv[1].split('/').reverse()?.[1]
  const projectOptions = await getProjectOptions(processDirectory)
  makeBoilerplate(processDirectory, projectOptions)
}
