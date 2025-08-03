// /app/hr/admin/salary-components/schemas.ts

import { z } from "zod";

export const salaryComponentSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Component name is required." })
    .min(2, { message: "Component name must be at least 2 characters." })
    .max(255, { message: "Component name must not exceed 255 characters." }),
  name_arabic: z
    .string()
    .max(255, { message: "Arabic name must not exceed 255 characters." })
    .optional()
    .transform(val => val === "" ? null : val),
  type: z
    .enum(["earning", "deduction", "employer_contribution"], {
      errorMap: () => ({ message: "Please select a component type." }),
    }),
  computation_type: z
    .string()
    .min(1, { message: "Computation type is required." })
    .max(100, { message: "Computation type must not exceed 100 characters." })
    .default("standard"),
  calculation_method: z
    .enum(["prorata", "fixed_always", "fixed_if_working", "fixed_if_paid_days"], {
      errorMap: () => ({ message: "Please select a calculation method." }),
    }),
  main_account_code: z
    .string()
    .min(1, { message: "Main account code is required." })
    .max(50, { message: "Main account code must not exceed 50 characters." }),
  is_active: z.boolean().default(true),
});

export const deleteSalaryComponentSchema = z.object({
  id: z.string().uuid({ message: "Invalid salary component ID." }),
});

export type SalaryComponentFormData = z.infer<typeof salaryComponentSchema>;
export type DeleteSalaryComponentData = z.infer<typeof deleteSalaryComponentSchema>;