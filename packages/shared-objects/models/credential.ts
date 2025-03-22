import { z } from 'zod'

export const credsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type Credential = z.infer<typeof credsSchema>

export default Credential
