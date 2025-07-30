// /app/hr/admin/leaves/data.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export type LeaveRequest = {
  leave_request_id: number;
  employee_name: string;
  leave_type_name: string;
  start_date: string;
  end_date: string;
  hours_requested: number;
  status: string;
  request_date: string;
};

/**
 * Fetches all leave requests with associated employee and leave type names.
 */
export async function getLeaveRequests(): Promise<LeaveRequest[]> {
  const supabase = await createClient();
  
  // This RPC call joins the necessary tables in the database.
  const { data, error } = await supabase.rpc('get_all_leave_requests');

  if (error) {
    console.error("Error fetching leave requests:", error);
    return [];
  }
  
  return (data as LeaveRequest[]) || [];
}
