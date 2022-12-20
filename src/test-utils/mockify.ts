export const mockify = <
  // TODO figure out the smart way to use Parameters<> to derive
  // the record values from typeof jest.fn so that we don't have
  // an any type here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TAnalog extends Record<string, any>,
>(
  analog: TAnalog,
): TAnalog => {
  return Object.entries(analog).reduce<TAnalog>((acc, [key, value]) => {
    const newValue = typeof value === 'function' ? jest.fn(value) : value
    return {
      ...acc,
      [key]: newValue,
    }
  }, {} as TAnalog) as TAnalog
}
