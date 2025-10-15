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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      bloqueio: {
        Row: {
          created_at: string
          id: number
          status: string | null
          telefone: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          status?: string | null
          telefone?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          status?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      categorias_financeiras: {
        Row: {
          cor: string | null
          created_at: string | null
          icone: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          cor?: string | null
          created_at?: string | null
          icone?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          cor?: string | null
          created_at?: string | null
          icone?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      folowUp: {
        Row: {
          contagem: number | null
          created_at: string
          encerrado: boolean | null
          id: number
          nomeUsuario: string | null
          telefone: string | null
          time: string | null
          webhook: string | null
        }
        Insert: {
          contagem?: number | null
          created_at?: string
          encerrado?: boolean | null
          id?: number
          nomeUsuario?: string | null
          telefone?: string | null
          time?: string | null
          webhook?: string | null
        }
        Update: {
          contagem?: number | null
          created_at?: string
          encerrado?: boolean | null
          id?: number
          nomeUsuario?: string | null
          telefone?: string | null
          time?: string | null
          webhook?: string | null
        }
        Relationships: []
      }
      leadsProspectaIA: {
        Row: {
          created_at: string
          disparo: string | null
          empresa: string | null
          especialidades: string | null
          id: number
          rating: string | null
          review: string | null
          site: string | null
          telefone: string | null
        }
        Insert: {
          created_at?: string
          disparo?: string | null
          empresa?: string | null
          especialidades?: string | null
          id?: number
          rating?: string | null
          review?: string | null
          site?: string | null
          telefone?: string | null
        }
        Update: {
          created_at?: string
          disparo?: string | null
          empresa?: string | null
          especialidades?: string | null
          id?: number
          rating?: string | null
          review?: string | null
          site?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      transacoes_financeiras: {
        Row: {
          categoria_id: string | null
          created_at: string | null
          data: string
          data_pagamento: string | null
          data_vencimento: string | null
          descricao: string
          despesa_principal_id: string | null
          frequencia_recorrencia: string | null
          id: string
          observacoes: string | null
          parcela_atual: number | null
          status_pagamento: string | null
          tipo: string
          tipo_despesa: string | null
          total_parcelas: number | null
          transacao_origem_id: string | null
          updated_at: string | null
          usuario_id: string | null
          valor: number
          valor_dizimo: number | null
          valor_total: number | null
        }
        Insert: {
          categoria_id?: string | null
          created_at?: string | null
          data?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao: string
          despesa_principal_id?: string | null
          frequencia_recorrencia?: string | null
          id?: string
          observacoes?: string | null
          parcela_atual?: number | null
          status_pagamento?: string | null
          tipo: string
          tipo_despesa?: string | null
          total_parcelas?: number | null
          transacao_origem_id?: string | null
          updated_at?: string | null
          usuario_id?: string | null
          valor: number
          valor_dizimo?: number | null
          valor_total?: number | null
        }
        Update: {
          categoria_id?: string | null
          created_at?: string | null
          data?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string
          despesa_principal_id?: string | null
          frequencia_recorrencia?: string | null
          id?: string
          observacoes?: string | null
          parcela_atual?: number | null
          status_pagamento?: string | null
          tipo?: string
          tipo_despesa?: string | null
          total_parcelas?: number | null
          transacao_origem_id?: string | null
          updated_at?: string | null
          usuario_id?: string | null
          valor?: number
          valor_dizimo?: number | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_financeiras_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_financeiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_financeiras_despesa_principal_id_fkey"
            columns: ["despesa_principal_id"]
            isOneToOne: false
            referencedRelation: "transacoes_financeiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_financeiras_transacao_origem_id_fkey"
            columns: ["transacao_origem_id"]
            isOneToOne: false
            referencedRelation: "transacoes_financeiras"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string | null
          email: string
          empresa: string
          id: string
          nome: string
          perfil: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          empresa: string
          id?: string
          nome: string
          perfil?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          empresa?: string
          id?: string
          nome?: string
          perfil?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      list_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          schema_name: string
          table_name: string
          table_type: string
        }[]
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