// /app/hr/admin/salary-components/data.ts
"use server";

import { createClient } from "@/utils/supabase/server";

// Type definition for a single salary component type object.
export type SalaryComponentType = {
  component_type_id: number;
  name: string;
  description: string | null;
  is_taxable: boolean;
  is_basic_salary: boolean;
  display_order: number;
  main_account_code: string | null;
  dimension_1: string | null;
  dimension_2: string | null;
  dimension_3: string | null;
  dimension_4: string | null;
  dimension_5: string | null;
  created_date: string;
};

/**
 * Fetches all salary component types from the database using an RPC call.
 */
export async function getSalaryComponentTypes(): Promise<SalaryComponentType[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_all_salary_component_types');

    if (error) {
        console.error("Error fetching salary component types:", error);
        return [];
    }
    
    return (data as SalaryComponentType[]) || [];
}
