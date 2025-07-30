// /app/hr/admin/leave-types/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const getLeaveTypeDataFromFormData = (formData: FormData) => {
  const policyType = formData.get("policy_type") as string;
  const isGranted = policyType === 'granted';

  const getNumberOrNull = (field: string) => {
    const value = formData.get(field) as string;
    return value ? Number(value) : null;
  };
  
  // Assuming 8 hours per workday for conversion from days to hours for DB storage
  const getHoursFromDays = (field: string) => {
      const days = getNumberOrNull(field);
      return days !== null ? days * 8 : null;
  };

  return {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    is_paid: formData.get("is_paid") === "on",
    carryover_allowed: formData.get("carryover_allowed") === "on",
    
    // Convert days from UI to hours for DB
    accrual_rate: isGranted ? null : getHoursFromDays("accrual_rate"),
    max_accrual_hours: getHoursFromDays("max_accrual_hours"),
    max_carryover_hours: getHoursFromDays("max_carryover_hours"),
    
    max_times_usable: getNumberOrNull("max_times_usable"),
    usage_period: formData.get("usage_period") as string || null,
    min_employment_months: getNumberOrNull("min_employment_months"),
    gender_restriction: formData.get("gender_restriction") as string || 'any',
    max_days_per_occurrence: getNumberOrNull("max_days_per_occurrence"),
    requires_documentation: formData.get("requires_documentation") === "on",

    created_by: "admin",
    modified_by: "admin",
  };
};

export async function addLeaveType(formData: FormData) {
  const supabase = await createClient();
  const leaveTypeData = getLeaveTypeDataFromFormData(formData);

  if (!leaveTypeData.name) {
    return { error: "Leave type name is required." };
  }

  const { error } = await supabase.from("leave_type").insert(leaveTypeData);

  if (error) {
    console.error("Error adding leave type:", error);
    return { error: "Failed to add leave type. " + error.message };
  }

  revalidatePath("/hr/admin/leave-types");
  return { success: "Leave type added successfully." };
}

export async function updateLeaveType(leaveTypeId: number, formData: FormData) {
    const supabase = await createClient();
    const leaveTypeData = getLeaveTypeDataFromFormData(formData);

    if (!leaveTypeData.name) {
        return { error: "Leave type name is required." };
    }

    const { error } = await supabase
        .from("leave_type")
        .update(leaveTypeData)
        .eq("leave_type_id", leaveTypeId);

    if (error) {
        console.error("Error updating leave type:", error);
        return { error: "Failed to update leave type. " + error.message };
    }

    revalidatePath("/hr/admin/leave-types");
    return { success: "Leave type updated successfully." };
}


export async function deleteLeaveType(leaveTypeId: number) {
    const supabase = await createClient();
    const { data: balances } = await supabase.from('leave_balance').select('leave_type_id').eq('leave_type_id', leaveTypeId).limit(1);

    if (balances && balances.length > 0) {
        return { error: "Cannot delete a leave type that is in use by an employee's balance." };
    }

    const { error } = await supabase.from("leave_type").delete().eq("leave_type_id", leaveTypeId);

    if (error) {
        console.error("Error deleting leave type:", error);
        return { error: "Failed to delete leave type. " + error.message };
    }

    revalidatePath("/hr/admin/leave-types");
    return { success: "Leave type deleted successfully." };
}
