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
import AuthMiddleware from './middleware/auth_middleware'
import { onRequest } from 'firebase-functions/v2/https'

const expressApp = express()
expressApp.use(express.json({ limit: '100kb' }))

// Libraries
const firebase = initializeFirebase()

const auth = getAuth(firebase)
const firestore = getFirestore(firebase)

// Repositories
const userRepository = new FirestoreUserRepository(firestore)
const credRepository = new FirestoreCredentialRepository(firestore)

// Middleware
const authMiddleware = new AuthMiddleware(auth)

// Controllers
const userController = new UserController(userRepository)
const authController = new AuthController(credRepository, auth)

// Routes
const userRoute = new UserRoute(userController, authMiddleware)
const authRoute = new AuthRoute(authController)

userRoute.setup(expressApp)
authRoute.setup(expressApp)

expressApp.use(notFoundHandler)
expressApp.use(errorHandler)

export const app = onRequest({ region: 'asia-southeast2' }, expressApp)
