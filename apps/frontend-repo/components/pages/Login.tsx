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
import Stack from '@mui/material/Stack'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { app } from '../../config/firebase'
import { setAuthState } from '../../store/auth'
import { useState } from 'react'
import { Alert } from '@mui/material'
import { backendUrl } from '../../config/fetcher'
import Credential, { credsSchema } from '@repo/shared-objects/models/credential'
import { ZodError } from 'zod'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  [theme.breakpoints.down('sm')]: {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,

    [theme.breakpoints.down('sm')]: {
      backgroundImage: 'none',
      backgroundColor: 'white',

      ...theme.applyStyles('dark', {
        backgroundImage: 'none',
        backgroundColor: 'black',
      }),
    },

    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}))

export default function Login() {
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
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
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
            {errors.root && (
              <Alert severity="error">{errors.root.message}</Alert>
            )}
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
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={errors.email ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={errors.password !== undefined}
                helperText={errors.password?.message}
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                {...register('password')}
                color={errors.password ? 'error' : 'primary'}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || isSubmitting}
            >
              Sign in
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </>
  )
}
