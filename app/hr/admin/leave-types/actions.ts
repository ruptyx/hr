// /app/hr/admin/leave-types/actions.ts  
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { leaveTypeSchema } from "./schemas";

export async function createLeaveType(data: any) {
  const supabase = await createClient();
  
  const result = leaveTypeSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { data: existing } = await supabase
    .from("leave_types")
    .select("id")
    .or(`code.ilike.${result.data.code},name.ilike.${result.data.name}`)
    .single();

  if (existing) {
    return { error: "Leave type with this code or name already exists" };
  }

  const { error } = await supabase
    .from("leave_types")
    .insert(result.data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/hr/admin/leave-types");
  return { success: true };
}

export async function updateLeaveType(id: string, data: any) {
  const supabase = await createClient();
  
  const result = leaveTypeSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { data: existing } = await supabase
    .from("leave_types")
    .select("id")
    .or(`code.ilike.${result.data.code},name.ilike.${result.data.name}`)
    .neq("id", id)
    .single();

  if (existing) {
    return { error: "Leave type with this code or name already exists" };
  }

  const { error } = await supabase
    .from("leave_types")
    .update(result.data)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/hr/admin/leave-types");
  return { success: true };
}

export async function deleteLeaveType(id: string) {
  const supabase = await createClient();

  // Check for dependencies
  const { data: dependencies } = await supabase
    .from("leave_accrual_tiers")
    .select("id")
    .eq("leave_type_id", id)
    .limit(1);

  if (dependencies?.length) {
    return { error: "Cannot delete leave type with existing accrual tiers" };
  }

  const { error } = await supabase
    .from("leave_types")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/hr/admin/leave-types");
  return { success: true };
}