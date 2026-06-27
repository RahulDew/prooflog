export const API_VERSION = 'v1'

export const PLAN_LIMITS = {
  free: 1_000,
  starter: 50_000,
  growth: 500_000,
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL: 500,
} as const