import UserController from '../controller/user_controller'
import AuthMiddleware from '../middleware/auth_middleware'
import express from 'express'

export default class UserRoute {
  private _controller: UserController
  private _authMiddleware: AuthMiddleware

  constructor(controller: UserController, authMiddleware: AuthMiddleware) {
    this._controller = controller
    this._authMiddleware = authMiddleware
  }

  public setup(app: express.Express) {
    app.get(
      '/fetch-user-data',
      // this._authMiddleware.authMiddleware,
      this._controller.fetchUserData
    )
    app.post(
      '/update-user-data',
      this._authMiddleware.authMiddleware,
      this._controller.updateUserData
    )
  }
}
