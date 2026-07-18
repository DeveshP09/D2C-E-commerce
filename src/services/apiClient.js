const BASE_URL = 'https://fakestoreapi.com'

const buildQuery = (params) => {
  if (!params) return ''
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) search.append(key, value)
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

const request = async (path, { method = 'GET', params, body, headers } = {}) => {
  const response = await fetch(`${BASE_URL}${path}${buildQuery(params)}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = new Error(`Request failed: ${response.status} ${response.statusText}`)
    error.status = response.status
    throw error
  }

  return response.json()
}

export const ApiClient = {
  get: (path, config) => request(path, { ...config, method: 'GET' }),
  post: (path, body, config) => request(path, { ...config, method: 'POST', body }),
  put: (path, body, config) => request(path, { ...config, method: 'PUT', body }),
  delete: (path, config) => request(path, { ...config, method: 'DELETE' }),
}
