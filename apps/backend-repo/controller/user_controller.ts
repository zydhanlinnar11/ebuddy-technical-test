import { Handler, Response } from 'express'
import UserRepository from '../repository/user_repository'
import User, { userSchema } from '../models/user'

export default class UserController {
  private _repo: UserRepository

  constructor(repo: UserRepository) {
    this._repo = repo
  }

  fetchUserData: Handler = async (req, res) => {
    let id: number | null = null
    if (typeof req.query.id === 'string') {
      id = Number.parseInt(req.query.id)
    } else if (
      Array.isArray(req.query.id) &&
      req.query.id.length > 0 &&
      typeof req.query.id[0] === 'string'
    ) {
      id = Number.parseInt(req.query.id[0])
    }

    if (id === null) {
      const users = await this._repo.getAll()

      res.json(users)
      return
    }

    const user = await this._repo.getById(id)

    if (user === null) {
      this.sendUserNotFoundResponse(res, id)
      return
    }

    res.json(user)
  }

  updateUserData: Handler = async (req, res) => {
    const user = await userSchema.validate(req.body)

    await this._repo.save(user)
  }

  private sendUserNotFoundResponse = (res: Response, id: number) => {
    res.status(404)
    res.json({ message: `User ID ${id} is not found` })
  }
}
