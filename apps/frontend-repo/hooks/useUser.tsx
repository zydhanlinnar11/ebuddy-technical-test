'use client'

import { fetcher } from '../config/fetcher'
import useSWRImmutable from 'swr/immutable'
import User from '@repo/shared-objects/models/user'

export const useUser = (shouldFetch?: boolean) => {
  const { data, ...res } = useSWRImmutable<User>(
    shouldFetch ? '/fetch-user-data' : null,
    fetcher
  )

  return { user: data, ...res }
}
