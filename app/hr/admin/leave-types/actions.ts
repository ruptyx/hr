"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { leaveTypeSchema } from "./schemas";

const getLeaveTypeDataFromFormData = (formData: FormData) => {
  const validatedFields = leaveTypeSchema.safeParse({
    name: formData.get("name"),
    policy_type: formData.get("policy_type"),
    description: formData.get("description"),
    is_paid: formData.get("is_paid") === "on",
    accrual_rate: formData.get("accrual_rate"),
    max_accrual_hours: formData.get("max_accrual_hours"),
    carryover_allowed: formData.get("carryover_allowed") === "on",
    max_carryover_hours: formData.get("max_carryover_hours"),
    min_employment_months: formData.get("min_employment_months"),
    gender_restriction: formData.get("gender_restriction"),
    usage_period: formData.get("usage_period"),
    max_times_usable: formData.get("max_times_usable"),
    max_days_per_occurrence: formData.get("max_days_per_occurrence"),
    requires_documentation: formData.get("requires_documentation") === "on",
  });

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const { policy_type, ...rest } = validatedFields.data;
  const isGranted = policy_type === "granted";

  const toHours = (days: number | null | undefined) => (days ? days * 8 : null);

  return {
    ...rest,
    accrual_rate: isGranted ? null : toHours(validatedFields.data.accrual_rate),
    max_accrual_hours: toHours(validatedFields.data.max_accrual_hours),
    max_carryover_hours: toHours(validatedFields.data.max_carryover_hours),
    created_by: "admin",
    modified_by: "admin",
  };
};

export async function addLeaveType(formData: FormData) {
  const supabase = await createClient();
  try {
    const leaveTypeData = getLeaveTypeDataFromFormData(formData);

    const { error } = await supabase.from("leave_type").insert(leaveTypeData);

    if (error) {
      console.error("Error adding leave type:", error);
      return { error: "Failed to add leave type. " + error.message };
    }

    revalidatePath("/hr/admin/leave-types");
    return { success: "Leave type added successfully." };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateLeaveType(leaveTypeId: number, formData: FormData) {
  const supabase = await createClient();
  try {
    const leaveTypeData = getLeaveTypeDataFromFormData(formData);

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
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteLeaveType(leaveTypeId: number) {
  const supabase = await createClient();
  const { data: balances } = await supabase
    .from("leave_balance")
    .select("leave_type_id")
    .eq("leave_type_id", leaveTypeId)
    .limit(1);

  if (balances && balances.length > 0) {
    return {
      error: "Cannot delete a leave type that is in use by an employee's balance.",
    };
  }

  const { error } = await supabase
    .from("leave_type")
    .delete()
    .eq("leave_type_id", leaveTypeId);

  if (error) {
    console.error("Error deleting leave type:", error);
    return { error: "Failed to delete leave type. " + error.message };
  }

  revalidatePath("/hr/admin/leave-types");
  return { success: "Leave type deleted successfully." };
}