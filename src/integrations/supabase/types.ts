export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          content: string
          created_at: string
          id: number
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      Fenomenpet: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      submission_likes: {
        Row: {
          created_at: string
          submission_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          submission_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          submission_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_likes_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          }
        ]
      }
      submissions: {
        Row: {
          comment: string
          created_at: string
          id: number
          image_url: string
          likes: number | null
          status: string | null
          updated_at: string
          user_id: string | null
          username: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: number
          image_url: string
          likes?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          username: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: number
          image_url?: string
          likes?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]