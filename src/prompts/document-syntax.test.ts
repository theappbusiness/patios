import type { Choice } from 'prompts'
import { getDocumentSyntaxPrompt } from './document-syntax'

describe('getEntryPointPrompt', () => {
  const config = getDocumentSyntaxPrompt()

  it('allows a user to select from one of the options provided', () => {
    expect(config.type).toBe('select')
    expect(config.choices?.length).toBeGreaterThan(0)
  })

  it('allows the user to choose from JSON or YAML syntax', () => {
    const expectedSyntaxes = ['json', 'yaml']
    const choiceValues: string[] = Array.isArray(config.choices)
      ? config.choices.map(({ value }) => value)
      : []

    expect(config.choices?.length).toBe(expectedSyntaxes.length)
    expect(choiceValues).toEqual(expect.arrayContaining(expectedSyntaxes))
  })

  it('defaults to JSON syntax', () => {
    expect(config.initial).toBeDefined()
    expect((config.choices as Choice[])[config.initial as number]).toEqual(
      expect.objectContaining({ value: 'json' }),
    )
  })
})
