import { mockify } from './mockify'

describe('mockify', () => {
  const double = (input: number): number => input * 2
  const formatAsPrice = (input: number): string => `£${input.toFixed(2)}`
  const primitiveValue = 999
  const nestedObject = {
    foo: (): string => 'FOO!',
  }

  const mocked = mockify({
    double,
    formatAsPrice,
    primitiveValue,
    nestedObject,
  })

  it('returns a jest mock of each value that is a function of the supplied object', () => {
    const doubled = mocked.double(7)
    // @ts-expect-error top-level functions supplied should have a mock property https://bit.ly/3V8ImcV
    expect(mocked.double.mock).toBeDefined()
    expect(mocked.double).toHaveBeenCalledTimes(1)
    expect(mocked.double).toHaveBeenCalledWith(7)
    expect(doubled).toBe(14)

    const price1 = mocked.formatAsPrice(123.456)
    const price2 = mocked.formatAsPrice(789)
    // @ts-expect-error top-level functions supplied should have a mock property https://bit.ly/3V8ImcV
    expect(mocked.formatAsPrice.mock).toBeDefined()
    expect(mocked.formatAsPrice).toHaveBeenCalledTimes(2)
    expect(price1).toBe('£123.46')
    expect(price2).toBe('£789.00')
  })

  it('returns nested object values as-is', () => {
    // @ts-expect-error mock properties exist Jest mock functions https://bit.ly/3V8ImcV
    expect(mocked.nestedObject.foo.mock).toBeUndefined()
    expect(mocked.nestedObject).toBe(nestedObject)
    expect(mocked.nestedObject.foo()).toBe('FOO!')
  })

  it('returns mocked primitive values as-is', () => {
    expect(mocked.primitiveValue).toBe(primitiveValue)
  })
})
