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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          achievements: string | null
          additional_docs_paths: string[] | null
          advisors: string | null
          amount_raising: string | null
          annual_revenue: string | null
          burn_rate: string | null
          business_model: string | null
          company_linkedin: string | null
          company_registered: boolean | null
          competitive_advantage: string | null
          competitors: string | null
          consent_given: boolean
          contact_email: string
          contact_number: string | null
          core_product: string | null
          core_team: string | null
          created_at: string
          currency: string | null
          current_stage: string | null
          customer_count: string | null
          customer_segment: string | null
          deal_score: number | null
          demo_link: string | null
          equity_offered: string | null
          existing_investors: string | null
          financial_model_path: string | null
          founder_background: string | null
          founder_linkedin: string | null
          founder_names: string
          fsv_value_add: string | null
          funding_raised: string | null
          funding_stage: string | null
          growth_rate: string | null
          hq_city: string | null
          hq_country: string | null
          id: string
          industry: string | null
          ip_patents: string | null
          legal_issues: boolean | null
          legal_issues_explanation: string | null
          monthly_revenue: string | null
          open_to_mentorship: boolean | null
          partnerships: string | null
          pitch_deck_path: string
          problem_statement: string | null
          product_demo_path: string | null
          reference_code: string
          revenue_projections: string | null
          runway_months: string | null
          sam: string | null
          solution_overview: string | null
          som: string | null
          startup_name: string
          tam: string | null
          tech_stack: string | null
          updated_at: string
          use_of_funds: string | null
          usp: string | null
          website_url: string | null
          why_fsv: string | null
          year_incorporation: number | null
        }
        Insert: {
          achievements?: string | null
          additional_docs_paths?: string[] | null
          advisors?: string | null
          amount_raising?: string | null
          annual_revenue?: string | null
          burn_rate?: string | null
          business_model?: string | null
          company_linkedin?: string | null
          company_registered?: boolean | null
          competitive_advantage?: string | null
          competitors?: string | null
          consent_given?: boolean
          contact_email: string
          contact_number?: string | null
          core_product?: string | null
          core_team?: string | null
          created_at?: string
          currency?: string | null
          current_stage?: string | null
          customer_count?: string | null
          customer_segment?: string | null
          deal_score?: number | null
          demo_link?: string | null
          equity_offered?: string | null
          existing_investors?: string | null
          financial_model_path?: string | null
          founder_background?: string | null
          founder_linkedin?: string | null
          founder_names: string
          fsv_value_add?: string | null
          funding_raised?: string | null
          funding_stage?: string | null
          growth_rate?: string | null
          hq_city?: string | null
          hq_country?: string | null
          id?: string
          industry?: string | null
          ip_patents?: string | null
          legal_issues?: boolean | null
          legal_issues_explanation?: string | null
          monthly_revenue?: string | null
          open_to_mentorship?: boolean | null
          partnerships?: string | null
          pitch_deck_path: string
          problem_statement?: string | null
          product_demo_path?: string | null
          reference_code?: string
          revenue_projections?: string | null
          runway_months?: string | null
          sam?: string | null
          solution_overview?: string | null
          som?: string | null
          startup_name: string
          tam?: string | null
          tech_stack?: string | null
          updated_at?: string
          use_of_funds?: string | null
          usp?: string | null
          website_url?: string | null
          why_fsv?: string | null
          year_incorporation?: number | null
        }
        Update: {
          achievements?: string | null
          additional_docs_paths?: string[] | null
          advisors?: string | null
          amount_raising?: string | null
          annual_revenue?: string | null
          burn_rate?: string | null
          business_model?: string | null
          company_linkedin?: string | null
          company_registered?: boolean | null
          competitive_advantage?: string | null
          competitors?: string | null
          consent_given?: boolean
          contact_email?: string
          contact_number?: string | null
          core_product?: string | null
          core_team?: string | null
          created_at?: string
          currency?: string | null
          current_stage?: string | null
          customer_count?: string | null
          customer_segment?: string | null
          deal_score?: number | null
          demo_link?: string | null
          equity_offered?: string | null
          existing_investors?: string | null
          financial_model_path?: string | null
          founder_background?: string | null
          founder_linkedin?: string | null
          founder_names?: string
          fsv_value_add?: string | null
          funding_raised?: string | null
          funding_stage?: string | null
          growth_rate?: string | null
          hq_city?: string | null
          hq_country?: string | null
          id?: string
          industry?: string | null
          ip_patents?: string | null
          legal_issues?: boolean | null
          legal_issues_explanation?: string | null
          monthly_revenue?: string | null
          open_to_mentorship?: boolean | null
          partnerships?: string | null
          pitch_deck_path?: string
          problem_statement?: string | null
          product_demo_path?: string | null
          reference_code?: string
          revenue_projections?: string | null
          runway_months?: string | null
          sam?: string | null
          solution_overview?: string | null
          som?: string | null
          startup_name?: string
          tam?: string | null
          tech_stack?: string | null
          updated_at?: string
          use_of_funds?: string | null
          usp?: string | null
          website_url?: string | null
          why_fsv?: string | null
          year_incorporation?: number | null
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
