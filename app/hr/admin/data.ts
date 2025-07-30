// /app/lib/data.ts

import { createClient } from "@/utils/supabase/server"; // Use the client you set up

// Define types to match the JSON structure returned by our RPC function
export type DashboardMetric = {
  headcount: number;
  newHiresThisMonth: number;
  terminationsThisMonth: number;
  openPositions: number;
};

export type LifecycleEmployee = {
  party_id: number;
  name_english: string;
  start_date?: string;
  end_date?: string;
  position_title: string;
};

export type DashboardData = {
  metrics: DashboardMetric;
  onboardingList: LifecycleEmployee[];
  offboardingList: LifecycleEmployee[];
  activities: any[]; // Placeholder
};


export async function getAdminDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  // Call the database function
  const { data, error } = await supabase.rpc('get_admin_dashboard_data');

  if (error) {
    console.error('Error fetching admin dashboard data:', error.message);
    // In case of an error, return a default empty state to prevent the page from crashing
    return {
      metrics: { headcount: 0, newHiresThisMonth: 0, terminationsThisMonth: 0, openPositions: 0 },
      activities: [],
      onboardingList: [],
      offboardingList: [],
    };
  }

  // The data comes back as a single JSON object, which is exactly what our page needs.
  // We cast it to our defined type for type safety in the rest of the app.
  return data as DashboardData;
}