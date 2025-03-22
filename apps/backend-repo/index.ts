import express from 'express'
import errorHandler, { notFoundHandler } from './middleware/error_handler'
import UserController from './controller/user_controller'
import { StaticUserRepository } from './repository/user_repository'
import UserRoute from './routes/user_route'

async function main() {
  const app = express()
  const port = 3000

  // Repositories
  const userRepository = new StaticUserRepository([
    {
      id: 1,
      email: 'zydhanlinnar11@gmail.com',
      name: 'Zydhan Linnar Putra',
    },
    {
      id: 2,
      email: 'admin@zydhan.com',
      name: 'zydhan.com admin',
    },
  ])

  // Controllers
  const userController = new UserController(userRepository)

  // Routes
  const userRoute = new UserRoute(userController)
  userRoute.setup(app)

  app.use(notFoundHandler)
  app.use(errorHandler)
  app.listen(port, () => {
    console.log(`Backend is listening on port ${port}`)
  })
}

main()
