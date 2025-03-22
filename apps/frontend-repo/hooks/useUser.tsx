'use client'

import { fetcher } from '../config/fetcher'
import useSWRImmutable from 'swr/immutable'
import User from '@repo/shared-objects/models/user'

export const useUser = () => {
  const { data, ...res } = useSWRImmutable<User>('/fetch-user-data', fetcher)

  return { users: data, ...res }
}
