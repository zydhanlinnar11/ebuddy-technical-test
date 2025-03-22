export default interface CredentialRepository {
  hashedPasswordByEmail(email: string): Promise<string | null>
  userIdByEmail(email: string): Promise<string | null>
}

const COLLECTION_NAME = 'users'

export class FirestoreCredentialRepository implements CredentialRepository {
  private _firestore: FirebaseFirestore.Firestore

  constructor(firestore: FirebaseFirestore.Firestore) {
    this._firestore = firestore
  }

  async dataByEmail(
    email: string
  ): Promise<FirebaseFirestore.DocumentData | null> {
    const snaps = await this._firestore
      .collection(COLLECTION_NAME)
      .where('email', '==', email)
      .get()

    if (snaps.docs.length === 0) return null
    const snap = snaps.docs[0]
    if (!snap.exists) return null

    return snap.data()
  }

  async hashedPasswordByEmail(email: string): Promise<string | null> {
    const data = await this.dataByEmail(email)

    return data?.password ?? null
  }

  async userIdByEmail(email: string): Promise<string | null> {
    const data = await this.dataByEmail(email)

    return data?.id ?? null
  }
}
