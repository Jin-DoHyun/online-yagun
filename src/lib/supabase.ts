import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string
          room: string
          nick: string
          text: string
          created_at: string
        }
        Insert: {
          room: string
          nick: string
          text: string
        }
      }
      online_users: {
        Row: {
          id: string
          room: string
          nick: string
          last_seen: string
        }
        Insert: {
          room: string
          nick: string
        }
      }
    }
  }
}
