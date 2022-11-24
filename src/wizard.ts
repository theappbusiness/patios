import * as fs from 'fs'
import * as path from 'path'
import { prompt, PromptObject } from 'prompts'

interface ProjectOptions {
  projectName: string
  documentSyntax: string
  entryPoint: string
}

export const getProjectNamePrompt = (
  processDirectory: string,
): PromptObject => ({
  type: 'text',
  name: 'projectName',
  message: 'Project name',
  initial: processDirectory,
  validate: (input) =>
    !!input.match(/^[a-z0-9\-_]+$/i) ||
    'Project name may only contain letters, numbers, hyphens and underscores',
})

export const getDocumentSyntaxPrompt = (): PromptObject => ({
  name: 'documentSyntax',
  type: 'select',
  message: 'Document syntax',
  choices: [
    { title: 'JSON', value: 'json' },
    { title: 'YAML', value: 'yaml' },
  ],
  initial: 0,
})

export const getEntryPointPrompt = (documentSyntax: string): PromptObject => ({
  name: 'entryPoint',
  type: 'text',
  message: 'Entry point',
  initial: `openapi.${documentSyntax}`,
  validate: (input) =>
    !!input.match(
      new RegExp(
        `(.*)(?<!\\.|${documentSyntax === 'json' ? 'yaml' : 'json'})$`,
      ),
    ) ||
    `Entry point extension must match chosen document syntax (you chose ${documentSyntax})`,
  format: (input): string => {
    if (input.match(/(\.json|\.yaml)$/i)) {
      return input
    }
    return `${input}.${documentSyntax}`
  },
})

const getProjectOptions = async (
  processDirectory: string,
): Promise<ProjectOptions> => {
  const { projectName } = await prompt(getProjectNamePrompt(processDirectory))
  const { documentSyntax } = await prompt(getDocumentSyntaxPrompt())
  const { entryPoint } = await prompt(getEntryPointPrompt(documentSyntax))

  return {
    documentSyntax,
    entryPoint,
    projectName,
  } as ProjectOptions
}

const makeBoilerplate = (
  processDirectory: string,
  { entryPoint, projectName }: ProjectOptions,
): void => {
  let writeDirectory = '.'
  if (processDirectory !== projectName) {
    fs.mkdirSync(projectName)
    writeDirectory += `/${projectName}`
  }
  fs.writeFileSync(path.join(writeDirectory, entryPoint), 'Hello Spec!')
}

export const init = async (): Promise<void> => {
  const processDirectory = path.parse(process.env.INIT_CWD || '').base
  const projectOptions = await getProjectOptions(processDirectory)
  makeBoilerplate(processDirectory, projectOptions)
}
