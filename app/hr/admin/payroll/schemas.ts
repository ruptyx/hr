import { z } from "zod";

/**
 * Defines the schema for the payroll period selection form.
 * This is used to validate the user's input before fetching employee data.
 */
export const payrollSelectionSchema = z.object({
  // The payroll period, represented as a string 'YYYY-MM'.
  period: z.string().regex(/^\d{4}-\d{2}$/, "Period must be in YYYY-MM format."),
  // The ID of the payroll set to process - using z.number() directly for better type safety
  payroll_set_id: z.number().min(1, "You must select a payroll set."),
});

/**
 * Defines the schema for a single employee's payroll calculation result.
 * This can be used to validate the data structure before storing or displaying it.
 */
export const employeePayrollDataSchema = z.object({
  employee_party_id: z.number(),
  employee_name: z.string(),
  department: z.string().nullable(),
  position: z.string().nullable(),
  
  // Financials
  basic_salary: z.number().default(0),
  gross_pay: z.number().default(0),
  total_deductions: z.number().default(0),
  net_pay: z.number().default(0),

  // Attendance & Leave
  days_present: z.number().default(0),
  days_absent: z.number().default(0),
  unpaid_leave_days: z.number().default(0),

  // Status
  status: z.enum(['Pending', 'Calculated', 'Approved', 'Error']).default('Pending'),
  
  // Detailed Breakdown (for drill-down view)
  earnings: z.array(z.object({ name: z.string(), amount: z.number() })).default([]),
  deductions: z.array(z.object({ name: z.string(), amount: z.number() })).default([]),
});

// We can create a type from the schema for easy use in our components.
export type EmployeePayrollData = z.infer<typeof employeePayrollDataSchema>;
export type PayrollSelectionFormData = z.infer<typeof payrollSelectionSchema>;