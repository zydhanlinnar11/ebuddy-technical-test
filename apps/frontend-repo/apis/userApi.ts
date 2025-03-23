import User from '@repo/shared-objects/models/user'
import { backendUrl } from '../config/fetcher'

export type UserPayload = Omit<User, 'id'>

export const updateUserData = async (data: UserPayload) => {
  const res = await fetch(`${backendUrl}/update-user-data`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  if (!res.ok) {
    throw new Error(`HTTP status code: ${res.status}`)
  }
}
