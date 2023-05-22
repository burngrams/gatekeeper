interface AuthMeta {
  authRequired: boolean
  role?: 'user' | 'admin'
}

interface DatabaseMeta {
  lowdbUrl: string
}

export interface Meta extends /* AuthMeta, */ DatabaseMeta {}
