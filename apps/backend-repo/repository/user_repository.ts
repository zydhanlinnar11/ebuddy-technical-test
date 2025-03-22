import User from '../models/user'

export default interface UserRepository {
  getById(id: number): Promise<User | null>
  getAll(): Promise<User[]>
  save(user: User): Promise<void>
}

export class StaticUserRepository implements UserRepository {
  private _users: User[]

  constructor(users: User[]) {
    this._users = users
  }

  async getAll(): Promise<User[]> {
    return this._users
  }

  async getById(id: number): Promise<User | null> {
    const user = this._users.find((user) => user.id === id)

    return user ?? null
  }

  async save(user: User): Promise<void> {
    let isExist = false
    for (let i = 0; i < this._users.length; i++) {
      const userDb = this._users[i]
      if (userDb.id !== user.id) {
        continue
      }

      isExist = true
      this._users[i] = user
    }

    if (!isExist) {
      this._users.push(user)
    }
  }
}

const COLLECTION_NAME = 'users'

export class FirestoreUserRepository implements UserRepository {
  private _firestore: FirebaseFirestore.Firestore

  constructor(firestore: FirebaseFirestore.Firestore) {
    this._firestore = firestore
  }

  async getById(id: number): Promise<User | null> {
    const snap = await this._firestore
      .collection(COLLECTION_NAME)
      .doc(`${id}`)
      .get()

    if (!snap.exists) return null
    const user = {
      id,
      ...snap.data(),
    } as any
    delete user.password
    return user
  }

  async getAll(): Promise<User[]> {
    const snaps = await this._firestore.collection(COLLECTION_NAME).get()

    let users: User[] = []

    snaps.forEach((snap) => {
      if (!snap.exists) return

      const user = {
        id: Number.parseInt(snap.ref.id),
        ...snap.data(),
      } as any
      delete user.password

      users.push(user)
    })

    return users
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
