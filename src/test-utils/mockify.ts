export const mockify = <
  // TODO figure out the smart way to use Parameters<> to derive
  // the record values from typeof jest.fn so that we don't have
  // an any type here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TAnalog extends Record<string, (...args: any[]) => unknown>,
>(
  analog: TAnalog,
): TAnalog => {
  return Object.entries(analog).reduce<TAnalog>((acc, [key, value]) => {
    return {
      ...acc,
      [key]: jest.fn(value),
    }
  }, {} as TAnalog) as TAnalog
}
