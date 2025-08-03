// /app/hr/admin/departments/data.ts
"use server";

import { createClient } from "@/utils/supabase/server";

// Type definition to match your new 'departments' table schema
export type Department = {
  id: string; // UUID
  name: string;
  parent_department_id: string | null;
  // Optional fields for hierarchy display
  parent_name?: string;
  children_count?: number;
  level?: number;
};

/**
 * Fetches all departments with hierarchy information using RPC call.
 * This will call a database function that handles the complex hierarchical query.
 */
export async function getDepartments(): Promise<Department[]> {
  const supabase = await createClient();

  // Call RPC function that handles hierarchical department fetching
  const { data, error } = await supabase.rpc('get_departments_hierarchy');

  if (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
  
  return (data as Department[]) || [];
}

/**
 * Fetches departments for dropdown/select options (flattened list)
 */
export async function getDepartmentsForSelect(): Promise<{ id: string; name: string; parent_name?: string }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_departments_for_select');

  if (error) {
    console.error("Error fetching departments for select:", error);
    return [];
  }
  
  return data || [];
}

/**
 * Check if department has children (for delete validation)
 */
export async function departmentHasChildren(departmentId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('departments')
    .select('id')
    .eq('parent_department_id', departmentId)
    .limit(1);

  if (error) {
    console.error("Error checking department children:", error);
    return false;
  }

  return (data && data.length > 0);
}