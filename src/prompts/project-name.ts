import type { PromptObject } from 'prompts'

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
