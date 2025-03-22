import { initializeApp } from 'firebase-admin/app'

function initializeFirebase() {
  const firebaseApp = initializeApp({ projectId: process.env.PROJECT_ID })

  return firebaseApp
}

export default initializeFirebase
