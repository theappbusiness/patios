export const randomiseCase = (text: string): string =>
  text
    .split('')
    .map((char) =>
      Math.round(Math.random()) ? char.toUpperCase() : char.toLowerCase(),
    )
    .join('')

export const getRandomString = (): string =>
  randomiseCase(Math.random().toString(36).substring(2))
