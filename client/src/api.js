const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error('Unable to connect to the server. Please check that the backend is running.')
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : null
  if (!response.ok) {
    throw new Error(data?.error || 'Something went wrong. Please try again.')
  }
  return data
}
