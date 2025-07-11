export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alunos: {
        Row: {
          created_at: string | null
          id: string
          matricula: string
          nome: string
          turma_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          matricula: string
          nome: string
          turma_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          matricula?: string
          nome?: string
          turma_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alunos_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "alunos_faltosos"
            referencedColumns: ["turma_id"]
          },
          {
            foreignKeyName: "alunos_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      atestados: {
        Row: {
          aluno_id: string | null
          created_at: string | null
          data_fim: string
          data_inicio: string
          descricao: string
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          aluno_id?: string | null
          created_at?: string | null
          data_fim: string
          data_inicio: string
          descricao: string
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          aluno_id?: string | null
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          descricao?: string
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "atestados_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atestados_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos_faltosos"
            referencedColumns: ["aluno_id"]
          },
        ]
      }
      escola_configuracao: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          email: string
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          email: string
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          email?: string
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      justificativas_faltas: {
        Row: {
          aluno_id: string | null
          created_at: string
          id: string
          motivo: string
          presenca_id: string
          updated_at: string
        }
        Insert: {
          aluno_id?: string | null
          created_at?: string
          id?: string
          motivo: string
          presenca_id: string
          updated_at?: string
        }
        Update: {
          aluno_id?: string | null
          created_at?: string
          id?: string
          motivo?: string
          presenca_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_aluno"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_aluno"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos_faltosos"
            referencedColumns: ["aluno_id"]
          },
          {
            foreignKeyName: "justificativas_faltas_presenca_id_fkey"
            columns: ["presenca_id"]
            isOneToOne: false
            referencedRelation: "presencas"
            referencedColumns: ["id"]
          },
        ]
      }
      observacoes_alunos: {
        Row: {
          aluno_id: string
          created_at: string | null
          descricao: string
          id: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          aluno_id: string
          created_at?: string | null
          descricao: string
          id?: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          aluno_id?: string
          created_at?: string | null
          descricao?: string
          id?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "observacoes_alunos_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observacoes_alunos_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos_faltosos"
            referencedColumns: ["aluno_id"]
          },
        ]
      }
      presencas: {
        Row: {
          aluno_id: string
          created_at: string | null
          data_chamada: string
          falta_justificada: boolean
          id: string
          presente: boolean
          turma_id: string
        }
        Insert: {
          aluno_id: string
          created_at?: string | null
          data_chamada: string
          falta_justificada?: boolean
          id?: string
          presente?: boolean
          turma_id: string
        }
        Update: {
          aluno_id?: string
          created_at?: string | null
          data_chamada?: string
          falta_justificada?: boolean
          id?: string
          presente?: boolean
          turma_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "presencas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presencas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos_faltosos"
            referencedColumns: ["aluno_id"]
          },
          {
            foreignKeyName: "presencas_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "alunos_faltosos"
            referencedColumns: ["turma_id"]
          },
          {
            foreignKeyName: "presencas_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_atrasos: {
        Row: {
          aluno_id: string
          criado_em: string | null
          data_atraso: string
          horario_registro: string
          id: string
        }
        Insert: {
          aluno_id: string
          criado_em?: string | null
          data_atraso: string
          horario_registro?: string
          id?: string
        }
        Update: {
          aluno_id?: string
          criado_em?: string | null
          data_atraso?: string
          horario_registro?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_aluno"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_aluno"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos_faltosos"
            referencedColumns: ["aluno_id"]
          },
        ]
      }
      registros_contato_busca_ativa: {
        Row: {
          aluno_id: string
          created_at: string
          data_contato: string
          forma_contato: string
          id: string
          justificativa_faltas: string
          link_arquivo: string | null
          monitor_responsavel: string
          updated_at: string
        }
        Insert: {
          aluno_id: string
          created_at?: string
          data_contato: string
          forma_contato: string
          id?: string
          justificativa_faltas: string
          link_arquivo?: string | null
          monitor_responsavel: string
          updated_at?: string
        }
        Update: {
          aluno_id?: string
          created_at?: string
          data_contato?: string
          forma_contato?: string
          id?: string
          justificativa_faltas?: string
          link_arquivo?: string | null
          monitor_responsavel?: string
          updated_at?: string
        }
        Relationships: []
      }
      turmas: {
        Row: {
          created_at: string | null
          escola_id: string | null
          id: string
          nome: string
          numero_sala: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          escola_id?: string | null
          id?: string
          nome: string
          numero_sala?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          escola_id?: string | null
          id?: string
          nome?: string
          numero_sala?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_turmas_escola"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "escola_configuracao"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          escola_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          escola_id: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          escola_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_escola_id_fkey"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "escola_configuracao"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      alunos_faltosos: {
        Row: {
          aluno_id: string | null
          aluno_nome: string | null
          matricula: string | null
          total_faltas: number | null
          turma_id: string | null
          turma_nome: string | null
        }
        Relationships: []
      }
      view_registros_completo: {
        Row: {
          criado_em: string | null
          data_atraso: string | null
          horario_registro: string | null
          id: string | null
          nome_aluno: string | null
          nome_turma: string | null
        }
        Relationships: []
      }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
