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
      bids: {
        Row: {
          bid_end_time: string
          bid_start_time: string
          created_at: string
          gpus_per_hour: number
          id: string
          price_per_gpu_hour: number
          total_bid_price: number
          total_gpu_hours: number
          total_hours: number
          user_id: number
        }
        Insert: {
          bid_end_time: string
          bid_start_time: string
          created_at?: string
          gpus_per_hour: number
          id?: string
          price_per_gpu_hour: number
          total_bid_price: number
          total_gpu_hours: number
          total_hours: number
          user_id: number
        }
        Update: {
          bid_end_time?: string
          bid_start_time?: string
          created_at?: string
          gpus_per_hour?: number
          id?: string
          price_per_gpu_hour?: number
          total_bid_price?: number
          total_gpu_hours?: number
          total_hours?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bids_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      gpus: {
        Row: {
          cluster: string | null
          created_at: string
          id: string
        }
        Insert: {
          cluster?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          cluster?: string | null
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          bid_id: string | null
          created_at: string
          id: string
          user_id: number
        }
        Insert: {
          bid_id?: string | null
          created_at?: string
          id: string
          user_id: number
        }
        Update: {
          bid_id?: string | null
          created_at?: string
          id?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservations_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reserved_gpu_hours: {
        Row: {
          bid_id: string
          created_at: string
          gpu_id: string
          hour_start_time: string
          id: number
          price_per_gpu_hour: number
        }
        Insert: {
          bid_id: string
          created_at?: string
          gpu_id: string
          hour_start_time: string
          id?: number
          price_per_gpu_hour: number
        }
        Update: {
          bid_id?: string
          created_at?: string
          gpu_id?: string
          hour_start_time?: string
          id?: number
          price_per_gpu_hour?: number
        }
        Relationships: [
          {
            foreignKeyName: "reserved_gpu_hours_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reserved_gpu_hours_gpu_id_fkey"
            columns: ["gpu_id"]
            isOneToOne: false
            referencedRelation: "gpus"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      capacity_day: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
