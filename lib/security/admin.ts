import { createClient } from '@/lib/supabase'

export async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, authorised: false }
  }

  const adminIds = (process.env.MOVETI_ADMIN_USER_IDS || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)

  const adminEmails = (process.env.MOVETI_ADMIN_EMAILS || '')
    .split(',')
    .map(v => v.trim().toLowerCase())
    .filter(Boolean)

  const authorised =
    adminIds.includes(user.id) ||
    (!!user.email && adminEmails.includes(user.email.toLowerCase()))

  return { user, authorised }
}
