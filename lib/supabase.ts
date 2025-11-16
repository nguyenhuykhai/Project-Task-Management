import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          user_id: string;
          sprint_id: string;
          task: string;
          link: string;
          total_point: number;
          label: string;
          priority: string;
          status: string;
          percent: string;
          notes: string;
          owners: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sprint_id: string;
          task: string;
          link: string;
          total_point: number;
          label: string;
          priority: string;
          status: string;
          percent: string;
          notes: string;
          owners: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sprint_id?: string;
          task?: string;
          link?: string;
          total_point?: number;
          label?: string;
          priority?: string;
          status?: string;
          percent?: string;
          notes?: string;
          owners?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      sprints: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          start_date: string;
          end_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          start_date: string;
          end_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
