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
