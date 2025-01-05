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
      files: {
        Row: {
          bucket: string
          created_at: string | null
          id: string
          name: string
          path: string
          size: number
          type: string
          updated_at: string | null
        }
        Insert: {
          bucket: string
          created_at?: string | null
          id?: string
          name: string
          path: string
          size: number
          type: string
          updated_at?: string | null
        }
        Update: {
          bucket?: string
          created_at?: string | null
          id?: string
          name?: string
          path?: string
          size?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          category: string
          created_at: string | null
          description: string
          featured_image: string
          id: string
          image_gallery: string[] | null
          material: string
          nama: string
          price: number
          slug: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string | null
          description: string
          featured_image: string
          id?: string
          image_gallery?: string[] | null
          material: string
          nama: string
          price: number
          slug: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string | null
          description?: string
          featured_image?: string
          id?: string
          image_gallery?: string[] | null
          material?: string
          nama?: string
          price?: number
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
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
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}