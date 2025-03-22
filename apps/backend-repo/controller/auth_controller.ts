import { Handler, Response } from 'express'
import CredentialRepository from '../repository/credential_repository'
import { object, string, ValidationError } from 'yup'
import { compareSync } from 'bcryptjs'
import { Auth } from 'firebase-admin/auth'

export default class AuthController {
  private _credRepo: CredentialRepository
  private _auth: Auth

  constructor(passwordRepo: CredentialRepository, auth: Auth) {
    this._credRepo = passwordRepo
    this._auth = auth
  }

  createToken: Handler = async (req, res, next) => {
    const schema = object({
      email: string().email().required(),
      password: string().required(),
    })

    try {
      const credential = await schema.validate(req.body)

      const [userId, hashedPassword] = await Promise.all([
        await this._credRepo.userIdByEmail(credential.email),
        await this._credRepo.hashedPasswordByEmail(credential.email),
      ])
      console.log({ userId, hashedPassword })
      if (
        hashedPassword === null ||
        userId === null ||
        !compareSync(credential.password, hashedPassword)
      ) {
        this.sendIncorrectCredentialError(res)
        return
      }

      const token = await this._auth.createCustomToken(`${userId}`)
      res.json({
        message: 'OK',
        token,
      })
    } catch (e) {
      if (!(e instanceof ValidationError)) {
        next(e)
        return
      }

      res.status(400)
      res.json({ message: e.message })
    }
  }

  private sendIncorrectCredentialError = (res: Response) => {
    res.status(400)
    res.json({ message: 'Incorrect email or password' })
  }
}
