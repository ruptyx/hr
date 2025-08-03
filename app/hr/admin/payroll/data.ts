"use server";
// Suggested path: /app/payroll/run/data.ts
import { createClient } from "@/utils/supabase/server";

// This type represents the initial data fetched for an employee in a payroll set.
// It's a combination of data from multiple tables.
export type EmployeeForPayroll = {
  party_id: number;
  name_english: string;
  position: { title: string | null } | null;
  department: { department_name: string | null } | null;
  compensation: { amount: number }[]; // An employee might have multiple compensations, we'll likely use the latest active one.
};

// Define the PayrollSet type to match what the component expects
export type PayrollSet = {
  payroll_set_id: number;
  name: string | null;
};

/**
 * Fetches all employees belonging to a specific payroll set.
 * This function is designed to gather the initial data needed to display the employee list.
 * * NOTE: This is a simplified query. A real-world scenario would need to join more tables
 * and handle cases where data (like position or department) might be missing.
 * The query assumes a `payroll_set_employee` link table exists.
 * If not, the logic would need to adapt (e.g., fetch all employees of the company associated with the set).
 *
 * @param payrollSetId The ID of the payroll set.
 * @returns A promise that resolves to an array of EmployeeForPayroll objects.
 */
export async function getEmployeesForPayrollSet(payrollSetId: number): Promise<EmployeeForPayroll[]> {
    const supabase = await createClient();

    try {
        // This query structure assumes a linking table `payroll_set_employee` exists.
        // If your schema links employees to sets differently, this will need to be adjusted.
        // For example, if a payroll_set is linked to a company, you'd fetch all employees of that company.
        const { data, error } = await supabase
            .from('employee')
            .select(`
                party_id,
                name_english,
                position_fulfillment!inner(
                    position!inner(
                        title:position_type(title),
                        department(department_name)
                    )
                ),
                compensation(amount, is_active, from_date)
            `)
            // This 'where' clause is a placeholder. You need a way to link employees to a payroll_set.
            // This might be a direct foreign key on the employee table or a join table.
            // .eq('payroll_set_id', payrollSetId) // Example filter
            .eq('compensation.is_active', true) // Only fetch active compensation records
            .order('from_date', { foreignTable: 'compensation', ascending: false });

        if (error) {
            console.error("Error fetching employees for payroll:", error);
            return [];
        }

        if (!data) {
            return [];
        }

        // The query above is complex. Here's a simplified interpretation of the result processing.
        // You would need to map the raw Supabase result to the `EmployeeForPayroll` type.
        const processedData = (data as any[]).map(emp => ({
            party_id: emp.party_id,
            name_english: emp.name_english,
            // Safely navigate the nested structure from the query
            position: emp.position_fulfillment?.[0]?.position?.title ? { title: emp.position_fulfillment[0].position.title.title } : { title: null },
            department: emp.position_fulfillment?.[0]?.position?.department ? { department_name: emp.position_fulfillment[0].position.department.department_name } : { department_name: null },
            // Find the most recent active compensation
            compensation: emp.compensation && emp.compensation.length > 0 ? [{ amount: emp.compensation[0].amount }] : [{ amount: 0 }],
        }));

        return processedData as EmployeeForPayroll[];
    } catch (error) {
        console.error("Unexpected error fetching employees for payroll:", error);
        return [];
    }
}

/**
 * Fetches all active payroll sets to populate the selection dropdown.
 * @returns A promise that resolves to an array of payroll set objects.
 */
export async function getPayrollSets(): Promise<PayrollSet[]> {
    const supabase = await createClient();
    
    try {
        const { data, error } = await supabase
            .from('payroll_set')
            .select('payroll_set_id, name')
            .eq('is_active', true)
            .order('name');

        if (error) {
            console.error("Error fetching payroll sets:", error);
            return [];
        }
        
        // Ensure we return an array even if data is null
        return (data || []).map(item => ({
            payroll_set_id: item.payroll_set_id,
            name: item.name,
        }));
    } catch (error) {
        console.error("Unexpected error fetching payroll sets:", error);
        return [];
    }
}