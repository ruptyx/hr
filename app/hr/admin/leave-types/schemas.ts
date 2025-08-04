// /app/hr/admin/leave-types/schemas.ts

import { z } from "zod";

export const leaveTypeSchema = z.object({
  code: z.string().min(1, "Code is required").max(20, "Code too long").toUpperCase(),
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  name_arabic: z.string().max(255, "Arabic name too long").optional(),
  behavior_type: z.enum(["paid", "unpaid", "half_paid", "carry_forward"]),
  eligibility_after_days: z.coerce.number().int().min(0).optional(),
  total_days_allowed_per_year: z.coerce.number().min(0).max(365).optional(),
  attachment_is_mandatory: z.boolean().default(false),
  leave_payment_component_id: z.string().uuid().optional(),
  encashment_payment_component_id: z.string().uuid().optional(),
  expense_account_code: z.string().max(50).optional(),
  provision_account_code: z.string().max(50).optional(),
  is_active: z.boolean().default(true),
});

export type LeaveTypeInput = z.infer<typeof leaveTypeSchema>;