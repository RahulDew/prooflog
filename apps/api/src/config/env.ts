export type Bindings = {
  DATABASE_URL: string
}

export type Variables = {
  organisationId: string
}

export type AppEnv = {
  Bindings: Bindings
  Variables: Variables
}