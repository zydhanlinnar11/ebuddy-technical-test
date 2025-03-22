import 'dotenv/config'
import express from 'express'
import errorHandler, { notFoundHandler } from './middleware/error_handler'
import UserController from './controller/user_controller'
import { FirestoreUserRepository } from './repository/user_repository'
import UserRoute from './routes/user_route'
import initializeFirebase from './config/firebase'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { FirestoreCredentialRepository } from './repository/credential_repository'
import AuthController from './controller/auth_controller'
import AuthRoute from './routes/auth_route'

async function main() {
  const app = express()
  app.use(express.json({ limit: '100kb' }))
  const port = 3000

  // Libraries
  const firebase = initializeFirebase()

  const auth = getAuth(firebase)
  const firestore = getFirestore(firebase)

  // Repositories
  const userRepository = new FirestoreUserRepository(firestore)
  const credRepository = new FirestoreCredentialRepository(firestore)

  // Controllers
  const userController = new UserController(userRepository)
  const authController = new AuthController(credRepository, auth)

  // Routes
  const userRoute = new UserRoute(userController)
  const authRoute = new AuthRoute(authController)

  userRoute.setup(app)
  authRoute.setup(app)

  app.use(notFoundHandler)
  app.use(errorHandler)
  app.listen(port, () => {
    console.log(`Backend is listening on port ${port}`)
  })
}

main()
