import UserController from '../controller/user_controller'
import express from 'express'

export default class UserRoute {
  private _controller: UserController

  constructor(controller: UserController) {
    this._controller = controller
  }

  public setup(app: express.Express) {
    app.get('/fetch-user-data', this._controller.fetchUserData)
  }
}
