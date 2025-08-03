"use server";
import { EmployeePayrollData, employeePayrollDataSchema } from "@/app/hr/admin/payroll/schemas";
// Suggested path: /app/payroll/run/actions.ts
import { createClient } from "@/utils/supabase/server";

/**
 * The core payroll calculation engine.
 * This server action takes the period and payroll set, fetches all required data,
 * and returns the calculated payroll for each employee.
 *
 * @param period The payroll period in 'YYYY-MM' format.
 * @param payrollSetId The ID of the payroll set to process.
 * @returns A promise that resolves to an array of EmployeePayrollData objects.
 */
export async function calculatePayroll(period: string, payrollSetId: number): Promise<{ data?: EmployeePayrollData[], error?: string }> {
    console.log(`Starting payroll calculation for period: ${period}, set: ${payrollSetId}`);
    const supabase = await createClient();

    try {
        // Step 1: Fetch all employees in the payroll set.
        // This query needs to be comprehensive, joining all necessary tables.
        const { data: employees, error: empError } = await supabase
            .from('employee') // This is a simplified starting point
            .select(`
                party_id,
                name_english,
                department: position_fulfillment!inner(position!inner(department(department_name))),
                position: position_fulfillment!inner(position!inner(position_type(title))),
                compensations: compensation(component:compensation_component!inner(amount, type:salary_component_type(name, is_taxable, is_basic_salary)), amount, is_active, from_date)
            `)
            // This filter is a placeholder for how you link employees to a payroll set.
            // .in('party_id', [/* array of employee ids in the set */])
            .eq('compensations.is_active', true);

        if (empError) throw empError;
        if (!employees) throw new Error("No employees found for this payroll set.");

        const calculationResults: EmployeePayrollData[] = [];

        for (const employee of employees as any[]) {
            // Step 2: For each employee, perform the calculation.
            const [year, month] = period.split('-').map(Number);
            const workingDaysInMonth = new Date(year, month, 0).getDate(); // Get days in the given month

            // --- MOCK DATA: Replace with actual data fetching ---
            const attendance = { daysPresent: 20, daysAbsent: 2 }; // Mock attendance
            const leave = { unpaidLeaveDays: 1 }; // Mock leave
            // --- END MOCK DATA ---

            // Step 3: Calculate Earnings
            const earnings: { name: string, amount: number }[] = [];
            let basicSalary = 0;
            let grossPay = 0;

            const latestCompensation = employee.compensations?.[0];
            if (latestCompensation) {
                for (const comp of latestCompensation.component) {
                    const componentAmount = comp.amount;
                    earnings.push({ name: comp.type.name, amount: componentAmount });
                    grossPay += componentAmount;
                    if (comp.type.is_basic_salary) {
                        basicSalary = componentAmount;
                    }
                }
            }

            // Step 4: Calculate Deductions
            const deductions: { name: string, amount: number }[] = [];
            let totalDeductions = 0;
            const dailyRate = basicSalary / workingDaysInMonth;

            if (attendance.daysAbsent > 0) {
                const absenceDeduction = dailyRate * attendance.daysAbsent;
                deductions.push({ name: "Absence Deduction", amount: absenceDeduction });
                totalDeductions += absenceDeduction;
            }

            if (leave.unpaidLeaveDays > 0) {
                const unpaidLeaveDeduction = dailyRate * leave.unpaidLeaveDays;
                deductions.push({ name: "Unpaid Leave", amount: unpaidLeaveDeduction });
                totalDeductions += unpaidLeaveDeduction;
            }
            
            const taxDeduction = grossPay * 0.10; // Example: 10% tax
            deductions.push({ name: "Income Tax", amount: taxDeduction });
            totalDeductions += taxDeduction;


            // Step 5: Calculate Net Pay
            const netPay = grossPay - totalDeductions;

            // Step 6: Assemble the final data object and validate it.
            // FIX: Safely access nested data with optional chaining at each level.
            const departmentName = employee.department?.[0]?.position?.department?.department_name ?? 'N/A';
            const positionTitle = employee.position?.[0]?.position?.position_type?.title ?? 'N/A';

            const result = employeePayrollDataSchema.parse({
                employee_party_id: employee.party_id,
                employee_name: employee.name_english,
                department: departmentName,
                position: positionTitle,
                basic_salary: basicSalary,
                gross_pay: grossPay,
                total_deductions: totalDeductions,
                net_pay: netPay,
                days_present: attendance.daysPresent,
                days_absent: attendance.daysAbsent,
                unpaid_leave_days: leave.unpaidLeaveDays,
                status: 'Calculated',
                earnings,
                deductions
            });
            
            calculationResults.push(result);
        }

        return { data: calculationResults };
    } catch (e: any) {
        console.error("Payroll calculation failed:", e);
        return { error: e.message || "An unknown error occurred during payroll calculation." };
    }
}

/**
 * Placeholder action for generating payslips.
 */
export async function generatePayslips(payrollData: EmployeePayrollData[]) {
    console.log("Generating payslips for", payrollData.length, "employees.");
    return { success: "Payslip generation started." };
}

/**
 * Placeholder action for exporting a bank file.
 */
export async function exportBankFile(payrollData: EmployeePayrollData[], formatId: number) {
    console.log(`Exporting bank file for ${payrollData.length} employees using format ${formatId}.`);
    return { success: "Bank file generated." };
}
