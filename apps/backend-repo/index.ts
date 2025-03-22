import 'dotenv/config'
import express from 'express'
import errorHandler, { notFoundHandler } from './middleware/error_handler'
import UserController from './controller/user_controller'
import { FirestoreUserRepository } from './repository/user_repository'
import UserRoute from './routes/user_route'
import initializeFirebase from './config/firebase'
import { getFirestore } from 'firebase-admin/firestore'

async function main() {
  const app = express()
  app.use(express.json({ limit: '100kb' }))
  const port = 3000

  // Libraries
  const firebase = initializeFirebase()

  const firestore = getFirestore(firebase)

  // Repositories
  const userRepository = new FirestoreUserRepository(firestore)

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
