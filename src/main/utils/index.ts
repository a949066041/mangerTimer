export * from './launch'

export async function promiseExec(promiseFn: () => Promise<unknown>, times: number) {
  if (typeof promiseFn !== 'function' || !Number.isInteger(times) || times < 1) {
    return Promise.reject(new Error('Invalid arguments: promiseFn must be a function and times must be a positive integer'))
  }

  const results: unknown[] = []
  let currentPromise: Promise<unknown> = Promise.resolve()

  for (let i = 0; i < times; i++) {
    currentPromise = currentPromise
      .then(() => promiseFn())
      .then((result) => {
        results.push(result)
        return result
      })
  }

  return currentPromise.then(() => results)
}
