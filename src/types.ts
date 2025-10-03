export type RecordType = 'LDAP' | 'Local'

export interface LabelItem { text: string }

export interface Account {
  id: string
  labels: LabelItem[] // stored as array of { text }
  type: RecordType
  login: string
  password: string | null
}
