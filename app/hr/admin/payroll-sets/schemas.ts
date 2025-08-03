// /app/hr/admin/payroll-sets/schemas.ts

import { z } from "zod";

export const payrollSetSchema = z.object({
  set_name: z
    .string()
    .min(1, { message: "Payroll set name is required." })
    .min(3, { message: "Payroll set name must be at least 3 characters." })
    .max(255, { message: "Payroll set name must not exceed 255 characters." }),
  set_name_arabic: z
    .string()
    .optional()
    .transform(val => val === "" ? null : val),
  calculation_method: z
    .enum(["fixed_days", "calendar_days", "daily_wages"], {
      errorMap: () => ({ message: "Please select a calculation method." }),
    }),
  cut_off_day: z
    .number({ error: "Cut-off day must be a number." })
    .int({ message: "Cut-off day must be a whole number." })
    .min(1, { message: "Cut-off day must be between 1 and 31." })
    .max(31, { message: "Cut-off day must be between 1 and 31." }),
  working_hours_per_day: z
    .number({ error: "Working hours per day must be a number." })
    .min(0.1, { message: "Working hours per day must be greater than 0." })
    .max(24, { message: "Working hours per day cannot exceed 24." }),
  working_days_per_period: z
    .number({ error: "Working days per period must be a number." })
    .min(0.1, { message: "Working days per period must be greater than 0." })
    .max(31, { message: "Working days per period cannot exceed 31." }),
  max_salary_deduction_percentage: z
    .number({ error: "Maximum deduction percentage must be a number." })
    .min(0, { message: "Maximum deduction percentage cannot be negative." })
    .max(100, { message: "Maximum deduction percentage cannot exceed 100%." })
    .optional()
    .transform(val => val === 0 ? null : val),
  is_active: z.boolean(),
});

export const deletePayrollSetSchema = z.object({
  id: z.string().uuid({ message: "Invalid payroll set ID." }),
});

export type PayrollSetFormData = z.infer<typeof payrollSetSchema>;
export type DeletePayrollSetData = z.infer<typeof deletePayrollSetSchema>;