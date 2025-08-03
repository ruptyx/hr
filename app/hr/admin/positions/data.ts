// /app/hr/admin/designations/data.ts

import { createClient } from "@/utils/supabase/server";

// Type definition to match your new 'designations' table schema
export type Designation = {
  id: string; // UUID
  name: string;
};

/**
 * Fetches all designations from the database using an RPC call.
 */
export async function getDesignations(): Promise<Designation[]> {
  const supabase = await createClient();

  // Call RPC function to get all designations
  const { data, error } = await supabase.rpc('get_all_designations');

  if (error) {
    console.error("Error fetching designations:", error);
    return [];
  }
  
  return (data as Designation[]) || [];
}