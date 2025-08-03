import { z } from "zod";

/**
 * Defines the schema for validating payroll set data from forms.
 * Updated to match the database schema and latest Zod practices.
 */
export const payrollSetSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Payroll set name is required." })
    .max(100, { message: "Payroll set name must be 100 characters or less." })
    .trim(),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val === "" ? null : val),
  company_party_id: z
    .number({ 
      error: "You must select a company.",
    })
    .int("Company ID must be an integer.")
    .positive("Company ID must be positive."),
  is_active: z.boolean().default(true),
});

export type PayrollSetInput = z.infer<typeof payrollSetSchema>;