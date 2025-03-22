import { Handler, Response } from 'express'
import { Auth } from 'firebase-admin/auth'

export default class AuthMiddleware {
  private _auth: Auth

  constructor(auth: Auth) {
    this._auth = auth
  }

  authMiddleware: Handler = async (req, res, next) => {
    const authHeader = req.headers.authorization ?? ''
    const [type, payload] = authHeader.split(' ')
    if (type !== 'Bearer') {
      this.sendUnauthorizedResponse(res)
      return
    }

    try {
      this._auth.verifyIdToken(payload)
    } catch (e) {
      this.sendUnauthorizedResponse(res)
    }
  }

  private sendUnauthorizedResponse = (res: Response) => {
    res.status(401)
    res.json({ message: 'unauthorized' })
  }
}
