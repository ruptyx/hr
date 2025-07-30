// /app/hr/admin/departments/data.ts
"use server";

import { createClient } from "@/utils/supabase/server";

// Type definition for a single department object.
// This should match the structure of the `department` table.
export type Department = {
  department_id: number;
  department_name: string;
  parent_department_id: number | null;
  created_date: string;
};

/**
 * Fetches all departments from the database using an RPC call.
 * @returns A promise that resolves to an array of Department objects.
 */
export async function getDepartments(): Promise<Department[]> {
    const supabase = await createClient();

    // We call the `get_all_departments` function we created in SQL.
    // The `.rpc()` method is used for calling PostgreSQL functions.
    const { data, error } = await supabase.rpc('get_all_departments');

    if (error) {
        console.error("Error fetching departments:", error);
        // Return an empty array on error to prevent the page from crashing.
        return [];
    }
    
    // The data is returned as a JSON array from the function, so we can cast it directly.
    return (data as Department[]) || [];
}
