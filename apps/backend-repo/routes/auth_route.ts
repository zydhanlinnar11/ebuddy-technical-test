import AuthController from '../controller/auth_controller'
import express from 'express'

export default class AuthRoute {
  private _controller: AuthController

  constructor(controller: AuthController) {
    this._controller = controller
  }

  public setup(app: express.Express) {
    app.post('/token', this._controller.createToken)
  }
}
