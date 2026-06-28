export type Bindings = {
  DATABASE_URL: string
}

export type Variables = Record<string, never>

export type AppEnv = {
  Bindings: Bindings
  Variables: Variables
}