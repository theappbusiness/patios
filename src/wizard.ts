import * as path from 'path'
import { prompt } from 'prompts'
import { makeBoilerplate } from './make-boilerplate'
import {
  getDocumentSyntaxPrompt,
  getEntryPointPrompt,
  getProjectNamePrompt,
} from './prompts'

export interface ProjectOptions {
  projectName: string
  documentSyntax: string
  entryPoint: string
}

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

export const init = async (): Promise<void> => {
  const processDirectory = path.parse(process.env.INIT_CWD || '').base
  const projectOptions = await getProjectOptions(processDirectory)
  makeBoilerplate(processDirectory, projectOptions)
}
