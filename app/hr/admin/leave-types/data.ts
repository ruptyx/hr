// /app/hr/admin/leave-types/data.ts
"use server";

import { createClient } from "@/utils/supabase/server";

// Updated type definition to remove eligibility_criteria.
export type LeaveType = {
  leave_type_id: number;
  name: string | null;
  description: string | null;
  is_paid: boolean;
  accrual_rate: number | null;
  max_accrual_hours: number | null;
  carryover_allowed: boolean;
  max_carryover_hours: number | null;
  created_date: string;
  max_times_usable: number | null;
  usage_period: string | null;
  min_employment_months: number | null;
  gender_restriction: string | null;
  max_days_per_occurrence: number | null;
  requires_documentation: boolean;
};

/**
 * Fetches all leave types from the database using an RPC call.
 * @returns A promise that resolves to an array of LeaveType objects.
 */
export async function getLeaveTypes(): Promise<LeaveType[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_all_leave_types');

    if (error) {
        console.error("Error fetching leave types:", error);
        return [];
    }
    
    return (data as LeaveType[]) || [];
}
