'use client'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import { getAuth, signInWithCustomToken, signOut } from 'firebase/auth'
import { app } from '../../config/firebase'
import { setAuthState } from '../../store/auth'
import { useEffect, useState } from 'react'
import { Alert, CircularProgress } from '@mui/material'
import { backendUrl } from '../../config/fetcher'
import Credential, { credsSchema } from '@repo/shared-objects/models/credential'
import { string, z, ZodError } from 'zod'
import PageContainer from '../molecules/Container'
import Card from '../molecules/Card'
import { useUser } from '../../hooks/useUser'
import User from '@repo/shared-objects/models/user'
import { setUpdateUserState } from '../../store/updateUser'

export default function Home() {
  const { loading, userId } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<Credential>()
  const router = useRouter()
  const [isSubmitting, setSubmitting] = useState(false)

  const submitForm: SubmitHandler<Credential> = async (data) => {
    clearErrors()
    setSubmitting(true)
    try {
      const validated = credsSchema.parse(data)
      const res = await fetch(`${backendUrl}/token`, {
        method: 'POST',
        body: JSON.stringify(validated),
      })
      const { token } = await res.json()

      const auth = getAuth(app)
      const userCredential = await signInWithCustomToken(auth, token)
      const user = userCredential.user

      dispatch(
        setAuthState({
          loading: false,
          userId: user.uid,
        })
      )
      router.push('/')
    } catch (e) {
      // @ts-expect-error
      if (e.code === 'auth/invalid-credential') {
        setError('root', { message: 'Invalid username or password!' })
        return
      }
      if (!(e instanceof ZodError)) {
        throw e
      }
      e.errors.forEach((e) => {
        setError(e.path as any, { message: e.message })
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <CssBaseline enableColorScheme />
      <PageContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Update User
          </Typography>
          <HomeCardInner />
        </Card>
      </PageContainer>
    </>
  )
}

type UserPayload = Omit<User, 'id'>

const HomeCardInner = () => {
  const [isShouldFetch, setShouldFetch] = useState(false)
  const {
    error: errorFetchUser,
    isLoading: isLoadingUser,
    isValidating: isValidatingUser,
    user,
    mutate,
  } = useUser(isShouldFetch)
  const { loading: isLoadingAuth, userId } = useAppSelector(
    (state) => state.auth
  )
  const updateUserState = useAppSelector((state) => state.updateUser)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<UserPayload>()
  const dispatch = useAppDispatch()
  const { push } = useRouter()

  const fetchData = () => setShouldFetch(true)
  const redirectToLogin = () => push('/login')
  const refetchData = () => mutate()

  useEffect(() => {
    if (!user) return

    setValue('email', user.email)
    setValue('name', user.name)
  }, [user])

  const submitForm: SubmitHandler<UserPayload> = async (data) => {
    clearErrors()
    dispatch(setUpdateUserState('loading'))
    try {
      const schema = z.object({
        name: string(),
        email: string().email(),
      })
      const validated = schema.parse(data)
      const res = await fetch(`${backendUrl}/update-user-data`, {
        method: 'POST',
        body: JSON.stringify(validated),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!res.ok) {
        throw new Error(`HTTP status code: ${res.status}`)
      }

      await refetchData()
      dispatch(setUpdateUserState('success'))
    } catch (e) {
      dispatch(setUpdateUserState('error'))
      if (!(e instanceof ZodError)) {
        setError('root', { message: 'Unable to update user data' })
        return
      }
      e.errors.forEach((e) => {
        setError(e.path as any, { message: e.message })
      })
    }
  }

  const logout = async () => {
    dispatch(setUpdateUserState('loading'))
    try {
      const auth = getAuth(app)
      await signOut(auth)
      dispatch(setUpdateUserState('success'))
    } catch (e) {
      dispatch(setUpdateUserState('error'))
      setError('root', { message: 'Unable to logging you out' })
    }
  }

  if (isLoadingAuth || isLoadingUser)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: '2rem' }}>
        <CircularProgress />
      </Box>
    )

  if (!userId) {
    return (
      <Button
        type="button"
        variant="contained"
        fullWidth
        onClick={redirectToLogin}
      >
        Sign in
      </Button>
    )
  }

  if (!isShouldFetch) {
    return (
      <Button type="button" variant="contained" fullWidth onClick={fetchData}>
        Fetch data
      </Button>
    )
  }

  if (errorFetchUser || !user) {
    return (
      <>
        <Alert severity="error">An error occured when loading user data.</Alert>
        <Button
          type="button"
          variant="contained"
          fullWidth
          onClick={refetchData}
          disabled={isValidatingUser}
        >
          Refetch data
        </Button>
      </>
    )
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitForm)}
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 2,
      }}
    >
      {updateUserState === 'success' && (
        <Alert severity="success">User successfully updated</Alert>
      )}
      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      <FormControl>
        <FormLabel htmlFor="name">Name</FormLabel>
        <TextField
          {...register('name')}
          error={errors.name !== undefined}
          helperText={errors.name?.message}
          id="name"
          type="name"
          name="name"
          placeholder="Lorem Ipsum"
          autoFocus
          required
          fullWidth
          variant="outlined"
          color={errors.name ? 'error' : 'primary'}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField
          {...register('email')}
          error={errors.email !== undefined}
          helperText={errors.email?.message}
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
          autoComplete="off"
          autoFocus
          required
          fullWidth
          variant="outlined"
          color={errors.email ? 'error' : 'primary'}
        />
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={updateUserState === 'loading'}
      >
        Update data
      </Button>
      <Button
        type="button"
        fullWidth
        variant="outlined"
        disabled={updateUserState === 'loading'}
        onClick={logout}
      >
        Log out
      </Button>
    </Box>
  )
}
