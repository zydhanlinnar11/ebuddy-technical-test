import Credential from '@repo/shared-objects/models/credential'
import { backendUrl } from '../config/fetcher'

export const tokenFromCredentials = async (data: Credential) => {
  const res = await fetch(`${backendUrl}/token`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error(`HTTP status code: ${res.status}`)
  }

  const { token } = await res.json()

  return token as string
}
