// /app/hr/admin/leave-types/data.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import type { LeaveType, SalaryComponent } from "./types";

export async function getLeaveTypes(): Promise<LeaveType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_all_leave_types');
  
  if (error) {
    console.error("Error fetching leave types:", error);
    return [];
  }
  
  return data || [];
}

export async function getSalaryComponents(): Promise<SalaryComponent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('salary_components')
    .select('id, name')
    .eq('type', 'earning')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error("Error fetching salary components:", error);
    return [];
  }
  
  return data || [];
}