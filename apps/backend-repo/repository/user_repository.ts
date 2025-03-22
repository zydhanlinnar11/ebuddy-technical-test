import User from '@repo/shared-objects/models/user'

export default interface UserRepository {
  getById(id: string): Promise<User | null>
  save(user: User): Promise<void>
}

const COLLECTION_NAME = 'users'

export class FirestoreUserRepository implements UserRepository {
  private _firestore: FirebaseFirestore.Firestore

  constructor(firestore: FirebaseFirestore.Firestore) {
    this._firestore = firestore
  }

  async getById(id: string): Promise<User | null> {
    const snap = await this._firestore.collection(COLLECTION_NAME).doc(id).get()

    if (!snap.exists) return null
    const user = {
      id,
      ...snap.data(),
    } as any
    delete user.password
    return user
  }

  async save(user: User): Promise<void> {
    await this._firestore.collection(COLLECTION_NAME).doc(`${user.id}`).set(
      {
        name: user.name,
        email: user.email,
      },
      { merge: true }
    )
  }
}
