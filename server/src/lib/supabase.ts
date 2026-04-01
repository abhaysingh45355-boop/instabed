import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  // In a real environment, we'd throw but here we might want to warn
  console.warn('Supabase environment variables are missing')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
