export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const fetcher = async (path: string, init?: RequestInit) => {
  return fetch(`${backendUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      ...init?.headers,
    },
    ...init,
  }).then((res) => res.json())
}
