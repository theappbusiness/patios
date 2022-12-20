export const randomiseCase = (text: string): string => {
  const pseudorandomDisplacement = Math.random() * Math.PI
  return text
    .split('')
    .map((char, i) => {
      const shouldUppercase = Math.round(
        Math.sin(pseudorandomDisplacement + (i * Math.PI) / text.length),
      )

      return shouldUppercase ? char.toUpperCase() : char.toLowerCase()
    })
    .join('')
}

export const getRandomString = (): string =>
  randomiseCase(Math.random().toString(36).substring(2))
