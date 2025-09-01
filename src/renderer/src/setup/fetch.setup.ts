import { patchFetch } from '~/api/fetch/patch'

function fetchAuthIntercept(req: RequestInit) {
  return req
}

async function fetchResponseIntercepet(res: Response) {
  return res
}

export function setupFetch() {
  patchFetch([fetchAuthIntercept], fetchResponseIntercepet, 'https://dummyjson.com')
}
