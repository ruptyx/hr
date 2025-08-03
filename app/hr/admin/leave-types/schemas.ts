// /app/hr/admin/leave-types/schemas.ts

import { z } from "zod";

export const leaveTypeSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Leave code is required." })
    .max(10, { message: "Leave code must not exceed 10 characters." })
    .regex(/^[A-Z0-9_]+$/, { message: "Leave code must contain only uppercase letters, numbers, and underscores." }),
  name: z
    .string()
    .min(1, { message: "Leave name is required." })
    .min(2, { message: "Leave name must be at least 2 characters." })
    .max(255, { message: "Leave name must not exceed 255 characters." }),
  name_arabic: z
    .string()
    .max(255, { message: "Arabic name must not exceed 255 characters." })
    .optional()
    .transform(val => val === "" ? null : val),
  behavior_type: z
    .enum(["paid", "unpaid", "half_paid", "carry_forward"], {
      errorMap: () => ({ message: "Please select a behavior type." }),
    }),
  eligibility_after_days: z
    .number({ error: "Eligibility days must be a number." })
    .int({ message: "Eligibility days must be a whole number." })
    .min(0, { message: "Eligibility days cannot be negative." })
    .max(32767, { message: "Eligibility days cannot exceed 32767." })
    .optional()
    .transform(val => val === 0 ? null : val),
  total_days_allowed_per_year: z
    .number({ error: "Total days must be a number." })
    .min(0, { message: "Total days cannot be negative." })
    .max(365, { message: "Total days cannot exceed 365." })
    .optional()
    .transform(val => val === 0 ? null : val),
  attachment_is_mandatory: z.boolean().optional(),
  leave_payment_component_id: z
    .string()
    .uuid({ message: "Invalid leave payment component ID." })
    .optional()
    .transform(val => val === "" || val === "none" ? null : val),
  encashment_payment_component_id: z
    .string()
    .uuid({ message: "Invalid encashment payment component ID." })
    .optional()
    .transform(val => val === "" || val === "none" ? null : val),
  expense_account_code: z
    .string()
    .max(50, { message: "Expense account code must not exceed 50 characters." })
    .optional()
    .transform(val => val === "" ? null : val),
  provision_account_code: z
    .string()
    .max(50, { message: "Provision account code must not exceed 50 characters." })
    .optional()
    .transform(val => val === "" ? null : val),
  is_active: z.boolean().default(true),
});

export const deleteLeaveTypeSchema = z.object({
  id: z.string().uuid({ message: "Invalid leave type ID." }),
});

export type LeaveTypeFormData = z.infer<typeof leaveTypeSchema>;
export type DeleteLeaveTypeData = z.infer<typeof deleteLeaveTypeSchema>;