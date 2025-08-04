// /app/hr/admin/leave-types/types.ts

export interface LeaveType {
  id: string;
  code: string;
  name: string;
  name_arabic?: string;
  behavior_type: "paid" | "unpaid" | "half_paid" | "carry_forward";
  eligibility_after_days?: number;
  total_days_allowed_per_year?: number;
  attachment_is_mandatory: boolean;
  leave_payment_component_id?: string;
  encashment_payment_component_id?: string;
  expense_account_code?: string;
  provision_account_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  leave_payment_component_name?: string;
  encashment_payment_component_name?: string;
}

export interface SalaryComponent {
  id: string;
  name: string;
}