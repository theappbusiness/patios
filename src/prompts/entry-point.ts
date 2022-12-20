import type { PromptObject } from 'prompts'

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
