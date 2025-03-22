import { Handler, Response } from 'express'
import CredentialRepository from '../repository/credential_repository'
import { compareSync } from 'bcryptjs'
import { Auth } from 'firebase-admin/auth'
import { ZodError } from 'zod'
import { credsSchema } from '@repo/shared-objects/models/credential'

export default class AuthController {
  private _credRepo: CredentialRepository
  private _auth: Auth

  constructor(passwordRepo: CredentialRepository, auth: Auth) {
    this._credRepo = passwordRepo
    this._auth = auth
  }

  createToken: Handler = async (req, res, next) => {
    try {
      const credential = credsSchema.parse(JSON.parse(req.body))

      const [userId, hashedPassword] = await Promise.all([
        await this._credRepo.userIdByEmail(credential.email),
        await this._credRepo.hashedPasswordByEmail(credential.email),
      ])

      if (
        hashedPassword === null ||
        userId === null ||
        !compareSync(credential.password, hashedPassword)
      ) {
        this.sendIncorrectCredentialError(res)
        return
      }

      const token = await this._auth.createCustomToken(userId)
      res.json({
        message: 'OK',
        token,
      })
    } catch (e) {
      if (!(e instanceof ZodError)) {
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
