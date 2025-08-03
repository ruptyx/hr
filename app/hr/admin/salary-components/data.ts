// /app/hr/admin/salary-components/data.ts

import { createClient } from "@/utils/supabase/server";

// Type definition to match your new 'salary_components' table schema
export type SalaryComponent = {
  id: string; // UUID
  name: string;
  name_arabic: string | null;
  type: string; // enum: component_type
  computation_type: string;
  calculation_method: string; // enum: component_calculation_method
  main_account_code: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

/**
 * Fetches all salary components from the database using an RPC call.
 */
export async function getSalaryComponents(): Promise<SalaryComponent[]> {
  const supabase = await createClient();

  // Call RPC function to get all salary components
  const { data, error } = await supabase.rpc('get_all_salary_components');

  if (error) {
    console.error("Error fetching salary components:", error);
    return [];
  }
  
  return (data as SalaryComponent[]) || [];
}