// /app/hr/admin/leave-types/data.ts
"use server";

import { createClient } from "@/utils/supabase/server";

// Type definition to match your new 'leave_types' table schema
export type LeaveType = {
  id: string; // UUID
  code: string;
  name: string;
  name_arabic: string | null;
  behavior_type: string; // enum: leave_behavior_type
  eligibility_after_days: number | null; // smallint
  total_days_allowed_per_year: number | null; // numeric
  attachment_is_mandatory: boolean | null;
  leave_payment_component_id: string | null; // UUID
  encashment_payment_component_id: string | null; // UUID
  expense_account_code: string | null;
  provision_account_code: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Optional fields for display
  leave_payment_component_name?: string;
  encashment_payment_component_name?: string;
};

/**
 * Fetches all leave types from the database using an RPC call.
 */
export async function getLeaveTypes(): Promise<LeaveType[]> {
  const supabase = await createClient();

  // Call RPC function to get all leave types with component names
  const { data, error } = await supabase.rpc('get_all_leave_types');

  if (error) {
    console.error("Error fetching leave types:", error);
    return [];
  }
  
  return (data as LeaveType[]) || [];
}

/**
 * Fetches salary components for dropdown options (only earnings for leave payments)
 */
export async function getSalaryComponentsForLeave(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('salary_components')
    .select('id, name')
    .eq('type', 'earning')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error("Error fetching salary components for leave:", error);
    return [];
  }
  
  return data || [];
}