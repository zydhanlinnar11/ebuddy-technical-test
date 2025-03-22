import 'dotenv/config'
import initializeFirebase from './config/firebase'
import { getFirestore } from 'firebase-admin/firestore'
import { faker } from '@faker-js/faker'
import { hashSync } from 'bcryptjs'

async function main() {
  // Libraries
  const firebase = initializeFirebase()

  const firestore = getFirestore(firebase)
  const numberOfData = 10
  const userPassword = faker.internet.password()
  const hashedPassword = hashSync(userPassword)

  firestore.runTransaction(async (t) => {
    console.log('checking seeder status')
    const seederStatus = await t.get(
      firestore.collection('status').doc('seeder')
    )

    const hasSeeded = seederStatus.exists && seederStatus.get('status') === true
    if (hasSeeded) {
      console.log('Database has been populated, skipping seeder')
      return
    }

    console.log(`Generating ${numberOfData} data`)
    for (let i = 0; i < numberOfData; i++) {
      const id = i + 1
      const ref = firestore.collection('users').doc(`${id}`)

      t.set(ref, {
        id,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: hashedPassword,
      })
    }

    t.set(seederStatus.ref, { status: true })
    console.log(
      `Data has been generated, use this password to sign in with any user: ${userPassword}`
    )
  })
}

main()
