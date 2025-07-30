// /app/hr/admin/data.ts
import { createClient } from "@/utils/supabase/server";

// =================================================================
// SHARED TYPES FOR FRONTEND COMPONENTS
// These are the "clean" types that our components will use.
// =================================================================

export type Activity = {
    id: string; // Unique ID for React key prop
    type: 'HIRE' | 'TERMINATION' | 'LEAVE_REQUEST' | 'PROMOTION';
    description: string;
    date: string; // ISO 8601 date string
};

export type Employee = {
    party_id: number;
    current_first_name: string;
    current_last_name: string;
    position_title: string;
    status: 'Onboarding' | 'Offboarding';
    start_date: string;
    end_date?: string;
};


// =================================================================
// RAW TYPES FROM DATABASE RPC
// These types match the JSON structure returned by the
// `get_admin_dashboard_data` PostgreSQL function.
// =================================================================

type OnboardingEmployeeData = {
  party_id: number;
  name_english: string;
  start_date: string;
  position_title: string;
  department_name: string;
};

type OffboardingEmployeeData = {
  party_id: number;
  name_english: string;
  end_date: string;
  position_title: string;
  department_name: string;
};

type PendingLeaveRequestData = {
    leave_request_id: number;
    employee_name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    request_date: string;
};

// This is the shape of the single JSON object returned by the DB function
export type DashboardDataFromRPC = {
  metrics: {
    headcount: number;
    newHiresThisMonth: number;
    terminationsThisMonth: number;
    openPositions: number;
    pendingLeaveRequests: number;
  };
  onboardingList: OnboardingEmployeeData[] | null; // DB can return null for empty lists
  offboardingList: OffboardingEmployeeData[] | null;
  pendingLeaveRequests: PendingLeaveRequestData[] | null;
};


// =================================================================
// DATA FETCHING FUNCTION
// =================================================================

export async function getAdminDashboardData(): Promise<DashboardDataFromRPC> {
  const supabase = await createClient();

  // Call the database function
  const { data, error } = await supabase.rpc('get_admin_dashboard_data');

  if (error) {
    console.error('Error fetching admin dashboard data:', error.message);
    // In case of an error, return a default empty state to prevent the page from crashing
    return {
      metrics: { headcount: 0, newHiresThisMonth: 0, terminationsThisMonth: 0, openPositions: 0, pendingLeaveRequests: 0 },
      onboardingList: [],
      offboardingList: [],
      pendingLeaveRequests: [],
    };
  }

  // The data comes back as a single JSON object.
  // We cast it to our defined type for type safety in the rest of the app.
  return data as DashboardDataFromRPC;
}
