import type { PromptObject } from 'prompts'

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
