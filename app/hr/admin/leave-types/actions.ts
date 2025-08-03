// /app/hr/admin/leave-types/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { leaveTypeSchema, deleteLeaveTypeSchema } from "./schemas";

export async function addLeaveType(formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    code: formData.get("code"),
    name: formData.get("name"),
    name_arabic: formData.get("name_arabic"),
    behavior_type: formData.get("behavior_type"),
    eligibility_after_days: formData.get("eligibility_after_days") 
      ? Number(formData.get("eligibility_after_days")) 
      : undefined,
    total_days_allowed_per_year: formData.get("total_days_allowed_per_year") 
      ? Number(formData.get("total_days_allowed_per_year")) 
      : undefined,
    attachment_is_mandatory: formData.get("attachment_is_mandatory") === "true",
    leave_payment_component_id: formData.get("leave_payment_component_id") || undefined,
    encashment_payment_component_id: formData.get("encashment_payment_component_id") || undefined,
    expense_account_code: formData.get("expense_account_code") || undefined,
    provision_account_code: formData.get("provision_account_code") || undefined,
    is_active: formData.get("is_active") === "true",
  };

  const validatedFields = leaveTypeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { 
    code,
    name, 
    name_arabic, 
    behavior_type, 
    eligibility_after_days,
    total_days_allowed_per_year,
    attachment_is_mandatory,
    leave_payment_component_id,
    encashment_payment_component_id,
    expense_account_code,
    provision_account_code,
    is_active 
  } = validatedFields.data;

  // Check if leave type with same code already exists
  const { data: existingLeaveType } = await supabase
    .from("leave_types")
    .select("id")
    .ilike("code", code)
    .single();

  if (existingLeaveType) {
    return { error: "A leave type with this code already exists." };
  }

  // Check if leave type with same name already exists
  const { data: existingName } = await supabase
    .from("leave_types")
    .select("id")
    .ilike("name", name)
    .single();

  if (existingName) {
    return { error: "A leave type with this name already exists." };
  }

  const { error } = await supabase.from("leave_types").insert({
    code,
    name,
    name_arabic,
    behavior_type,
    eligibility_after_days,
    total_days_allowed_per_year,
    attachment_is_mandatory,
    leave_payment_component_id,
    encashment_payment_component_id,
    expense_account_code,
    provision_account_code,
    is_active,
  });

  if (error) {
    return { error: "Failed to add leave type: " + error.message };
  }

  revalidatePath("/hr/admin/leave-types");
  return { success: "Leave type added successfully." };
}

export async function updateLeaveType(
  leaveTypeId: string,
  formData: FormData
) {
  const supabase = await createClient();

  // Validate leave type ID
  const idValidation = deleteLeaveTypeSchema.safeParse({ id: leaveTypeId });
  if (!idValidation.success) {
    return { error: "Invalid leave type ID." };
  }

  const rawData = {
    code: formData.get("code"),
    name: formData.get("name"),
    name_arabic: formData.get("name_arabic"),
    behavior_type: formData.get("behavior_type"),
    eligibility_after_days: formData.get("eligibility_after_days") 
      ? Number(formData.get("eligibility_after_days")) 
      : undefined,
    total_days_allowed_per_year: formData.get("total_days_allowed_per_year") 
      ? Number(formData.get("total_days_allowed_per_year")) 
      : undefined,
    attachment_is_mandatory: formData.get("attachment_is_mandatory") === "true",
    leave_payment_component_id: formData.get("leave_payment_component_id") || undefined,
    encashment_payment_component_id: formData.get("encashment_payment_component_id") || undefined,
    expense_account_code: formData.get("expense_account_code") || undefined,
    provision_account_code: formData.get("provision_account_code") || undefined,
    is_active: formData.get("is_active") === "true",
  };

  const validatedFields = leaveTypeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { 
    code,
    name, 
    name_arabic, 
    behavior_type, 
    eligibility_after_days,
    total_days_allowed_per_year,
    attachment_is_mandatory,
    leave_payment_component_id,
    encashment_payment_component_id,
    expense_account_code,
    provision_account_code,
    is_active 
  } = validatedFields.data;

  // Check if leave type exists
  const { data: leaveType } = await supabase
    .from("leave_types")
    .select("id, code, name")
    .eq("id", leaveTypeId)
    .single();

  if (!leaveType) {
    return { error: "Leave type not found." };
  }

  // Check if another leave type with same code already exists (excluding current one)
  const { data: existingCode } = await supabase
    .from("leave_types")
    .select("id")
    .ilike("code", code)
    .neq("id", leaveTypeId)
    .single();

  if (existingCode) {
    return { error: "A leave type with this code already exists." };
  }

  // Check if another leave type with same name already exists (excluding current one)
  const { data: existingName } = await supabase
    .from("leave_types")
    .select("id")
    .ilike("name", name)
    .neq("id", leaveTypeId)
    .single();

  if (existingName) {
    return { error: "A leave type with this name already exists." };
  }

  const { error } = await supabase
    .from("leave_types")
    .update({
      code,
      name,
      name_arabic,
      behavior_type,
      eligibility_after_days,
      total_days_allowed_per_year,
      attachment_is_mandatory,
      leave_payment_component_id,
      encashment_payment_component_id,
      expense_account_code,
      provision_account_code,
      is_active,
    })
    .eq("id", leaveTypeId);

  if (error) {
    return { error: "Failed to update leave type: " + error.message };
  }

  revalidatePath("/hr/admin/leave-types");
  return { success: "Leave type updated successfully." };
}

export async function deleteLeaveType(leaveTypeId: string) {
  const supabase = await createClient();

  // Validate leave type ID
  const idValidation = deleteLeaveTypeSchema.safeParse({ id: leaveTypeId });
  if (!idValidation.success) {
    return { error: "Invalid leave type ID." };
  }

  // Check if leave type exists
  const { data: leaveType } = await supabase
    .from("leave_types")
    .select("id, name")
    .eq("id", leaveTypeId)
    .single();

  if (!leaveType) {
    return { error: "Leave type not found." };
  }

  // Check if leave type is referenced in leave_accrual_tiers
  const { data: accrualTiers } = await supabase
    .from("leave_accrual_tiers")
    .select("id")
    .eq("leave_type_id", leaveTypeId)
    .limit(1);

  if (accrualTiers && accrualTiers.length > 0) {
    return { 
      error: "Cannot delete leave type that has accrual tiers. Please remove accrual tiers first." 
    };
  }

  // Check if leave type is referenced in leave_payment_tiers
  const { data: paymentTiers } = await supabase
    .from("leave_payment_tiers")
    .select("id")
    .eq("leave_type_id", leaveTypeId)
    .limit(1);

  if (paymentTiers && paymentTiers.length > 0) {
    return { 
      error: "Cannot delete leave type that has payment tiers. Please remove payment tiers first." 
    };
  }

  const { error } = await supabase
    .from("leave_types")
    .delete()
    .eq("id", leaveTypeId);

  if (error) {
    return { error: "Failed to delete leave type: " + error.message };
  }

  revalidatePath("/hr/admin/leave-types");
  return { success: "Leave type deleted successfully." };
}