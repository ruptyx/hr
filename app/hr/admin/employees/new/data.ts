// /app/hr/admin/employees/new/data.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export type Department = {
  department_id: number;
  department_name: string;
};

export type PositionTypeForForm = {
  position_type_id: number;
  title: string;
};

// New type for the manager dropdown
export type Manager = {
  party_id: number;
  name_english: string;
};

export async function getDepartmentsForForm(): Promise<Department[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('department')
        .select('department_id, department_name')
        .order('department_name');

    if (error) {
        console.error("Error fetching departments for form:", error);
        return [];
    }
    return data;
}

export async function getPositionTypesForForm(): Promise<PositionTypeForForm[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_all_position_types_for_form');

    if (error) {
        console.error("Error fetching position types for form:", error);
        return [];
    }
    return (data as PositionTypeForForm[]) || [];
}

// New function to fetch employees for the manager dropdown
export async function getEmployeesForManagerDropdown(): Promise<Manager[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_employees_for_manager_dropdown');

    if (error) {
        console.error("Error fetching employees for manager dropdown:", error);
        return [];
    }
    return (data as Manager[]) || [];
}
