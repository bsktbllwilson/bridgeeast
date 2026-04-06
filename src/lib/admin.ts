const DEFAULT_ADMIN_EMAIL = 'admin@bridgeeast.com'

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL
}

export function isAdminEmail(email: string) {
  return email.trim().toLowerCase() === getAdminEmail().trim().toLowerCase()
}