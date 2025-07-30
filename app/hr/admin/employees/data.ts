// /app/hr/employees/data.ts
"use server";

import { createClient } from "@/utils/supabase/server";

// Type for the list view, including manager's name
export type Employee = {
  party_id: number;
  name_english: string;
  email: string | null;
  mobile_number: string;
  manager_name: string | null;
};

// A simpler type for the manager dropdown
export type PotentialManager = {
    party_id: number;
    name_english: string;
}

// More detailed type for the single employee view
export type EmployeeDetail = {
    party_id: number;
    gender: string | null;
    birth_date: string | null; // Dates are strings from the DB
    marital_status: string | null;
    name_english: string;
    name_arabic: string | null;
    nationality: string | null;
    mobile_number: string;
    email: string | null;
    emergency_contact_number: string | null;
    religion: string | null;
    blood_group: string | null;
    manager_party_id: number | null;
};

// Type for salary component definitions
export type SalaryComponentType = {
    component_type_id: number;
    name: string;
    is_basic_salary: boolean;
};

// Type for the main compensation record
export type Compensation = {
    compensation_id: number;
    employee_party_id: number;
    from_date: string;
    thru_date: string | null;
    total_amount: number;
    compensation_component: CompensationComponent[];
};

// Type for individual components of a compensation package
export type CompensationComponent = {
    compensation_component_id: number;
    component_type_id: number;
    amount: number;
};


/**
 * Fetches ALL employees with their manager's name for the main list page.
 */
export async function getEmployees(): Promise<Employee[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_all_employees_with_managers');
  if (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
  return (data as Employee[]) || [];
}

/**
 * Fetches a list of all employees who can be a manager, excluding the specified employee.
 */
export async function getPotentialManagers(employeeIdToExclude: number): Promise<PotentialManager[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('employee')
        .select('party_id, name_english')
        .neq('party_id', employeeIdToExclude)
        .order('name_english');
    if (error) {
        console.error('Error fetching potential managers:', error);
        return [];
    }
    return data;
}

/**
 * Fetches a single employee's complete details by their party_id.
 */
export async function getEmployeeById(id: number): Promise<EmployeeDetail | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('employee')
        .select('*')
        .eq('party_id', id)
        .single();
    if (error) {
        console.error(`Error fetching employee with id ${id}:`, error);
        return null;
    }
    return data as EmployeeDetail;
}

/**
 * Fetches all available salary component types.
 */
export async function getSalaryComponentTypes(): Promise<SalaryComponentType[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('salary_component_type')
        .select('component_type_id, name, is_basic_salary')
        .order('display_order');
    if (error) {
        console.error('Error fetching salary component types:', error);
        return [];
    }
    return data;
}

/**
 * Fetches the current active compensation for a given employee, including its components.
 */
export async function getEmployeeCompensation(employeeId: number): Promise<Compensation | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('compensation')
        .select(`
            *,
            compensation_component ( * )
        `)
        .eq('employee_party_id', employeeId)
        .is('is_active', true)
        .single();

    if (error) {
        // It's normal for an employee to not have compensation yet, so don't log an error if not found
        if (error.code !== 'PGRST116') {
            console.error('Error fetching employee compensation:', error);
        }
        return null;
    }
    return data as Compensation;
}
