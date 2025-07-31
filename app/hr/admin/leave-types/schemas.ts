
import { z } from "zod";

export const leaveTypeSchema = z.object({
  name: z.string().min(3, { message: "Leave type name must be at least 3 characters." }),
  policy_type: z.enum(["accrued", "granted"]),
  description: z.string().optional(),
  is_paid: z.boolean().default(true),
  accrual_rate: z.coerce.number().optional(),
  max_accrual_hours: z.coerce.number().optional(),
  carryover_allowed: z.boolean().default(false),
  max_carryover_hours: z.coerce.number().optional(),
  min_employment_months: z.coerce.number().optional(),
  gender_restriction: z.enum(["any", "male", "female"]).default("any"),
  usage_period: z.enum(["per_year", "per_employment", "lifetime"]).optional(),
  max_times_usable: z.coerce.number().optional(),
  max_days_per_occurrence: z.coerce.number().optional(),
  requires_documentation: z.boolean().default(false),
});
