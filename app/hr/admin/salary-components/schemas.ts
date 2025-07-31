
import { z } from "zod";

export const salaryComponentSchema = z.object({
  name: z.string().min(3, { message: "Component name must be at least 3 characters." }),
  description: z.string().optional(),
  is_taxable: z.boolean().default(true),
  is_basic_salary: z.boolean().default(false),
  display_order: z.coerce.number().default(0),
  main_account_code: z.string().optional(),
  dimension_1: z.string().optional(),
  dimension_2: z.string().optional(),
  dimension_3: z.string().optional(),
  dimension_4: z.string().optional(),
  dimension_5: z.string().optional(),
});
