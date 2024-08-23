export function makeAPIRequest(
  path: string = '',
  method: string = 'GET',
  query: any = {},
  body: any = {},
  useAuthorization: boolean = false
): Promise<any> {
  return new Promise(async (resolve, _) => {
    let options: any = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    if (useAuthorization) options.headers['x-token'] = `${localStorage.getItem('auth_token')}`

    if (method !== 'GET') {
      options.body = JSON.stringify(body)
    }

    let finalPath = import.meta.env.VITE_API_URL + path
    if (query) {
      finalPath += '?' + new URLSearchParams(query)
    }

    await fetch(finalPath, options)
      .then(async (r) => {
        return resolve({
          json: await r.json(),
          status: r.status
        })
      })
      .catch((err) => {
        console.error(err)
        return resolve({
          error: 'CRITICAL_ERROR'
        })
      })
  })
}
