export type Customer = {
  id: string
  name: string
}

export interface CustomerWithApiTokens extends Customer {
  apiToken: string
}

export type FileAttribute = {
  key: string
  type: 'file'
  version?: string
  value?: string
  uploaded?: boolean
}

export type TextAttribute = {
  key: string
  type: 'text'
  value?: string
}

export type BooleanAttribute = {
  key: string
  type: 'boolean'
}

export type TagAttribute = FileAttribute | TextAttribute | BooleanAttribute

export type TagAttributes = { [key: string]: TagAttribute } & {
  src?: FileAttribute
  alt?: TextAttribute
  poster?: FileAttribute
  loading?: TextAttribute
  reveal?: TextAttribute
  'with-credentials'?: BooleanAttribute
}

export type Product = {
  id: string
  name: string
  slug: string
  tagAttributes: TagAttributes
}
