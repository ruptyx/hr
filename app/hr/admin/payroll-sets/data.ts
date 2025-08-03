// /app/hr/admin/payroll-sets/data.ts

import { createClient } from "@/utils/supabase/server";

// Type definition to match your new 'payroll_sets' table schema
export type PayrollSet = {
  id: string; // UUID
  set_name: string;
  set_name_arabic: string | null;
  calculation_method: string; // enum: payroll_calculation_method
  cut_off_day: number; // smallint
  working_hours_per_day: number; // numeric
  working_days_per_period: number; // numeric
  max_salary_deduction_percentage: number | null; // numeric, nullable
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

/**
 * Fetches all payroll sets from the database using an RPC call.
 */
export async function getPayrollSets(): Promise<PayrollSet[]> {
  const supabase = await createClient();

  // Call RPC function to get all payroll sets
  const { data, error } = await supabase.rpc('get_all_payroll_sets');

  if (error) {
    console.error("Error fetching payroll sets:", error);
    return [];
  }
  
  return (data as PayrollSet[]) || [];
}