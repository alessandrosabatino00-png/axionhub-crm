import { supabase } from './supabase'

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function getUserRole(userId: string) {
  const { data, error } = await supabase
    .from('agency_users')
    .select('role, agency_id')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
