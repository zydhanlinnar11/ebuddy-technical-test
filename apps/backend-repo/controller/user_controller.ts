import { Handler, Response } from 'express'
import UserRepository from '../repository/user_repository'
import { userSchema } from '@repo/shared-objects/models/user'
import { ZodError } from 'zod'
import { AuthenticatedRequest } from '../types/auth_request'

export default class UserController {
  private _repo: UserRepository

  constructor(repo: UserRepository) {
    this._repo = repo
  }

  fetchUserData: Handler = async (req: AuthenticatedRequest, res, next) => {
    try {
      const user = await this._repo.getById(req.userId ?? '')

      res.json(user)
    } catch (e) {
      next(e)
    }
  }

  updateUserData: Handler = async (req: AuthenticatedRequest, res, next) => {
    try {
      const { body } = req
      if (body) {
        body.id = req.userId ?? ''
      }
      const user = userSchema.parse(req.body)

      await this._repo.save(user)
      res.json({ message: 'OK' })
    } catch (e) {
      if (!(e instanceof ZodError)) {
        next(e)
        return
      }

      res.status(400)
      res.json({ message: e.message })
    }
  }
}
