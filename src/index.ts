import prompt, { Schema } from 'prompt'

const schema: Schema = {
  properties: {
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
}

const { documentSyntax } = await prompt.get(schema)
console.log(documentSyntax)
