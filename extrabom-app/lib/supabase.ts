import { createClient } from '@supabase/supabase-js'
// Conexão com o banco Supabase da EXTRABOM.
// Sem as variáveis de ambiente, o app funciona em modo local (demonstração).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = (url && key) ? createClient(url, key) : null
export const supabaseConectado = !!supabase
