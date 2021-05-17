const STALE_LIMIT = 2 * 60 * 60 * 1000

export const isStale = (timeStamp: string) => {
  const environmentDate = new Date(timeStamp).getTime()
  const difference = Date.now() - environmentDate
  return difference >= STALE_LIMIT
}

export const isProtected = (name: string) => name === 'master' || name.includes('test')
