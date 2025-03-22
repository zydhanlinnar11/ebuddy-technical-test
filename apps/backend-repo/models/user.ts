import { object, number, string, InferType } from 'yup'

export const userSchema = object({
  id: number().required(),
  name: string().required(),
  email: string().email().required(),
})

type User = InferType<typeof userSchema>

export default User
