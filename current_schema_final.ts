export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_config: {
        Row: {
          current_version_code: number
          current_version_name: string
          force_update_enabled: boolean | null
          id: number
          maintenance_message: string | null
          maintenance_mode: boolean | null
          min_supported_version_code: number
          min_supported_version_name: string
          update_check_interval_hours: number | null
          updated_at: string | null
        }
        Insert: {
          current_version_code: number
          current_version_name: string
          force_update_enabled?: boolean | null
          id?: number
          maintenance_message?: string | null
          maintenance_mode?: boolean | null
          min_supported_version_code: number
          min_supported_version_name: string
          update_check_interval_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          current_version_code?: number
          current_version_name?: string
          force_update_enabled?: boolean | null
          id?: number
          maintenance_message?: string | null
          maintenance_mode?: boolean | null
          min_supported_version_code?: number
          min_supported_version_name?: string
          update_check_interval_hours?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      app_versions: {
        Row: {
          created_at: string | null
          download_url: string | null
          id: number
          is_active: boolean | null
          is_mandatory: boolean | null
          min_supported_version: string | null
          platform: string
          release_notes: string | null
          runtime_version: string | null
          update_message: string | null
          update_type: string
          updated_at: string | null
          version_code: number
          version_name: string
        }
        Insert: {
          created_at?: string | null
          download_url?: string | null
          id?: number
          is_active?: boolean | null
          is_mandatory?: boolean | null
          min_supported_version?: string | null
          platform: string
          release_notes?: string | null
          runtime_version?: string | null
          update_message?: string | null
          update_type: string
          updated_at?: string | null
          version_code: number
          version_name: string
        }
        Update: {
          created_at?: string | null
          download_url?: string | null
          id?: number
          is_active?: boolean | null
          is_mandatory?: boolean | null
          min_supported_version?: string | null
          platform?: string
          release_notes?: string | null
          runtime_version?: string | null
          update_message?: string | null
          update_type?: string
          updated_at?: string | null
          version_code?: number
          version_name?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          date: string | null
          id: number
          notes: string | null
          staff_id: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date?: string | null
          id?: number
          notes?: string | null
          staff_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date?: string | null
          id?: number
          notes?: string | null
          staff_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          description: string | null
          expense_date: string | null
          expense_type: string
          id: number
          is_recurring: boolean | null
          payment_method: string | null
          receipt_url: string | null
          recorded_by: string | null
          recurring_period: string | null
          updated_at: string | null
          vendor_name: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          expense_date?: string | null
          expense_type: string
          id?: number
          is_recurring?: boolean | null
          payment_method?: string | null
          receipt_url?: string | null
          recorded_by?: string | null
          recurring_period?: string | null
          updated_at?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          expense_date?: string | null
          expense_type?: string
          id?: number
          is_recurring?: boolean | null
          payment_method?: string | null
          receipt_url?: string | null
          recorded_by?: string | null
          recurring_period?: string | null
          updated_at?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          ambience_rating: number | null
          comments: string | null
          created_at: string | null
          customer_id: string | null
          food_rating: number | null
          id: number
          order_id: number | null
          rating: number | null
          service_rating: number | null
          would_recommend: boolean | null
        }
        Insert: {
          ambience_rating?: number | null
          comments?: string | null
          created_at?: string | null
          customer_id?: string | null
          food_rating?: number | null
          id?: number
          order_id?: number | null
          rating?: number | null
          service_rating?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          ambience_rating?: number | null
          comments?: string | null
          created_at?: string | null
          customer_id?: string | null
          food_rating?: number | null
          id?: number
          order_id?: number | null
          rating?: number | null
          service_rating?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string | null
          created_at: string | null
          expiry_date: string | null
          id: number
          item_name: string
          last_restock_date: string | null
          location: string | null
          quantity: number
          reorder_level: number | null
          status: string | null
          supplier: string | null
          unit: string | null
          unit_cost: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: number
          item_name: string
          last_restock_date?: string | null
          location?: string | null
          quantity?: number
          reorder_level?: number | null
          status?: string | null
          supplier?: string | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: number
          item_name?: string
          last_restock_date?: string | null
          location?: string | null
          quantity?: number
          reorder_level?: number | null
          status?: string | null
          supplier?: string | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: number
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      menu_item_ingredients: {
        Row: {
          created_at: string
          id: number
          inventory_item_id: number
          menu_item_id: number
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: never
          inventory_item_id: number
          menu_item_id: number
          quantity: number
        }
        Update: {
          created_at?: string
          id?: never
          inventory_item_id?: number
          menu_item_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_ingredients_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_ingredients_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          calories: number | null
          category: string | null
          category_id: number | null
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          ingredients: string[] | null
          is_available: boolean | null
          is_spicy: boolean | null
          is_vegetarian: boolean | null
          name: string
          preparation_time: number | null
          price: number
          updated_at: string | null
        }
        Insert: {
          allergens?: string[] | null
          calories?: number | null
          category?: string | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          ingredients?: string[] | null
          is_available?: boolean | null
          is_spicy?: boolean | null
          is_vegetarian?: boolean | null
          name: string
          preparation_time?: number | null
          price: number
          updated_at?: string | null
        }
        Update: {
          allergens?: string[] | null
          calories?: number | null
          category?: string | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          ingredients?: string[] | null
          is_available?: boolean | null
          is_spicy?: boolean | null
          is_vegetarian?: boolean | null
          name?: string
          preparation_time?: number | null
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          id: string
          order_notifications_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: number
          menu_item_id: number | null
          menu_item_name: string
          order_id: number | null
          quantity: number
          special_instructions: string | null
          status: string | null
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          menu_item_id?: number | null
          menu_item_name: string
          order_id?: number | null
          quantity?: number
          special_instructions?: string | null
          status?: string | null
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          menu_item_id?: number | null
          menu_item_name?: string
          order_id?: number | null
          quantity?: number
          special_instructions?: string | null
          status?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          completed_time: string | null
          created_at: string | null
          customer_id: string | null
          customer_name: string | null
          discount_amount: number | null
          id: number
          is_served: boolean | null
          notes: string | null
          order_number: string
          order_time: string | null
          order_type: string | null
          prepared_time: string | null
          served_time: string | null
          status: string | null
          subtotal: number | null
          table_id: number | null
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
          waiter_id: string | null
        }
        Insert: {
          completed_time?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          id?: number
          is_served?: boolean | null
          notes?: string | null
          order_number: string
          order_time?: string | null
          order_type?: string | null
          prepared_time?: string | null
          served_time?: string | null
          status?: string | null
          subtotal?: number | null
          table_id?: number | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
          waiter_id?: string | null
        }
        Update: {
          completed_time?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          id?: number
          is_served?: boolean | null
          notes?: string | null
          order_number?: string
          order_time?: string | null
          order_type?: string | null
          prepared_time?: string | null
          served_time?: string | null
          status?: string | null
          subtotal?: number | null
          table_id?: number | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
          waiter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_waiter_id_fkey"
            columns: ["waiter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: number
          notes: string | null
          order_id: number | null
          payment_date: string | null
          payment_method: string | null
          processed_by: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: number
          notes?: string | null
          order_id?: number | null
          payment_date?: string | null
          payment_method?: string | null
          processed_by?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: number
          notes?: string | null
          order_id?: number | null
          payment_date?: string | null
          payment_method?: string | null
          processed_by?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          category: string | null
          created_at: string | null
          id: number
          invoice_number: string | null
          item_name: string
          notes: string | null
          purchase_date: string | null
          purchase_type: string | null
          purchased_by: string | null
          quantity: number
          receipt_url: string | null
          total_amount: number
          unit: string | null
          unit_price: number
          updated_at: string | null
          vendor_contact: string | null
          vendor_name: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: number
          invoice_number?: string | null
          item_name: string
          notes?: string | null
          purchase_date?: string | null
          purchase_type?: string | null
          purchased_by?: string | null
          quantity: number
          receipt_url?: string | null
          total_amount: number
          unit?: string | null
          unit_price: number
          updated_at?: string | null
          vendor_contact?: string | null
          vendor_name?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: number
          invoice_number?: string | null
          item_name?: string
          notes?: string | null
          purchase_date?: string | null
          purchase_type?: string | null
          purchased_by?: string | null
          quantity?: number
          receipt_url?: string | null
          total_amount?: number
          unit?: string | null
          unit_price?: number
          updated_at?: string | null
          vendor_contact?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_purchased_by_fkey"
            columns: ["purchased_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      push_tokens: {
        Row: {
          created_at: string | null
          device_info: Json | null
          id: string
          is_active: boolean | null
          token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          is_active?: boolean | null
          token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          is_active?: boolean | null
          token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: number
          party_size: number
          reservation_date: string
          reservation_time: string
          special_requests: string | null
          status: string | null
          table_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: number
          party_size: number
          reservation_date: string
          reservation_time: string
          special_requests?: string | null
          status?: string | null
          table_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: number
          party_size?: number
          reservation_date?: string
          reservation_time?: string
          special_requests?: string | null
          status?: string | null
          table_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          capacity: number
          created_at: string | null
          current_order_id: number | null
          id: number
          location: string | null
          status: string | null
          table_number: number
          updated_at: string | null
        }
        Insert: {
          capacity?: number
          created_at?: string | null
          current_order_id?: number | null
          id?: number
          location?: string | null
          status?: string | null
          table_number: number
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          current_order_id?: number | null
          id?: number
          location?: string | null
          status?: string | null
          table_number?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          address: string | null
          created_at: string | null
          department: string | null
          emergency_contact: string | null
          employee_id: string | null
          hire_date: string | null
          id: number
          position: string
          salary: number | null
          status: string | null
          termination_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          department?: string | null
          emergency_contact?: string | null
          employee_id?: string | null
          hire_date?: string | null
          id?: number
          position: string
          salary?: number | null
          status?: string | null
          termination_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          department?: string | null
          emergency_contact?: string | null
          employee_id?: string | null
          hire_date?: string | null
          id?: number
          position?: string
          salary?: number | null
          status?: string | null
          termination_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: number
          notes: string | null
          paid_by: string | null
          payment_date: string | null
          payment_type: string | null
          period_end: string | null
          period_start: string | null
          staff_id: number | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: number
          notes?: string | null
          paid_by?: string | null
          payment_date?: string | null
          payment_type?: string | null
          period_end?: string | null
          period_start?: string | null
          staff_id?: number | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: number
          notes?: string | null
          paid_by?: string | null
          payment_date?: string | null
          payment_type?: string | null
          period_end?: string | null
          period_start?: string | null
          staff_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_payments_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_payments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string | null
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_update_required: {
        Args: { p_current_version_code: number; p_platform?: string }
        Returns: {
          download_url: string
          is_mandatory: boolean
          latest_version_code: number
          latest_version_name: string
          update_message: string
          update_required: boolean
          update_type: string
        }[]
      }
      get_latest_version: {
        Args: { p_platform?: string }
        Returns: {
          download_url: string
          is_mandatory: boolean
          release_notes: string
          update_message: string
          update_type: string
          version_code: number
          version_name: string
        }[]
      }
      is_manager: { Args: never; Returns: boolean }
      is_owner: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
