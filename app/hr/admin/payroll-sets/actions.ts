// /app/hr/admin/payroll-sets/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { payrollSetSchema, deletePayrollSetSchema } from "./schemas";

export async function addPayrollSet(formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    set_name: formData.get("set_name"),
    set_name_arabic: formData.get("set_name_arabic"),
    calculation_method: formData.get("calculation_method"),
    cut_off_day: Number(formData.get("cut_off_day")),
    working_hours_per_day: Number(formData.get("working_hours_per_day")),
    working_days_per_period: Number(formData.get("working_days_per_period")),
    max_salary_deduction_percentage: formData.get("max_salary_deduction_percentage") 
      ? Number(formData.get("max_salary_deduction_percentage")) 
      : undefined,
    is_active: formData.get("is_active") === "true",
  };

  const validatedFields = payrollSetSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { 
    set_name, 
    set_name_arabic, 
    calculation_method, 
    cut_off_day, 
    working_hours_per_day, 
    working_days_per_period, 
    max_salary_deduction_percentage, 
    is_active 
  } = validatedFields.data;

  // Check if payroll set with same name already exists
  const { data: existingPayrollSet } = await supabase
    .from("payroll_sets")
    .select("id")
    .ilike("set_name", set_name)
    .single();

  if (existingPayrollSet) {
    return { error: "A payroll set with this name already exists." };
  }

  const { error } = await supabase.from("payroll_sets").insert({
    set_name,
    set_name_arabic,
    calculation_method,
    cut_off_day,
    working_hours_per_day,
    working_days_per_period,
    max_salary_deduction_percentage,
    is_active,
  });

  if (error) {
    return { error: "Failed to add payroll set: " + error.message };
  }

  revalidatePath("/hr/admin/payroll-sets");
  return { success: "Payroll set added successfully." };
}

export async function updatePayrollSet(
  payrollSetId: string,
  formData: FormData
) {
  const supabase = await createClient();

  // Validate payroll set ID
  const idValidation = deletePayrollSetSchema.safeParse({ id: payrollSetId });
  if (!idValidation.success) {
    return { error: "Invalid payroll set ID." };
  }

  const rawData = {
    set_name: formData.get("set_name"),
    set_name_arabic: formData.get("set_name_arabic"),
    calculation_method: formData.get("calculation_method"),
    cut_off_day: Number(formData.get("cut_off_day")),
    working_hours_per_day: Number(formData.get("working_hours_per_day")),
    working_days_per_period: Number(formData.get("working_days_per_period")),
    max_salary_deduction_percentage: formData.get("max_salary_deduction_percentage") 
      ? Number(formData.get("max_salary_deduction_percentage")) 
      : undefined,
    is_active: formData.get("is_active") === "true",
  };

  const validatedFields = payrollSetSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { 
    set_name, 
    set_name_arabic, 
    calculation_method, 
    cut_off_day, 
    working_hours_per_day, 
    working_days_per_period, 
    max_salary_deduction_percentage, 
    is_active 
  } = validatedFields.data;

  // Check if payroll set exists
  const { data: payrollSet } = await supabase
    .from("payroll_sets")
    .select("id, set_name")
    .eq("id", payrollSetId)
    .single();

  if (!payrollSet) {
    return { error: "Payroll set not found." };
  }

  // Check if another payroll set with same name already exists (excluding current one)
  const { data: existingPayrollSet } = await supabase
    .from("payroll_sets")
    .select("id")
    .ilike("set_name", set_name)
    .neq("id", payrollSetId)
    .single();

  if (existingPayrollSet) {
    return { error: "A payroll set with this name already exists." };
  }

  const { error } = await supabase
    .from("payroll_sets")
    .update({
      set_name,
      set_name_arabic,
      calculation_method,
      cut_off_day,
      working_hours_per_day,
      working_days_per_period,
      max_salary_deduction_percentage,
      is_active,
    })
    .eq("id", payrollSetId);

  if (error) {
    return { error: "Failed to update payroll set: " + error.message };
  }

  revalidatePath("/hr/admin/payroll-sets");
  return { success: "Payroll set updated successfully." };
}

export async function deletePayrollSet(payrollSetId: string) {
  const supabase = await createClient();

  // Validate payroll set ID
  const idValidation = deletePayrollSetSchema.safeParse({ id: payrollSetId });
  if (!idValidation.success) {
    return { error: "Invalid payroll set ID." };
  }

  // Check if payroll set exists
  const { data: payrollSet } = await supabase
    .from("payroll_sets")
    .select("id, set_name")
    .eq("id", payrollSetId)
    .single();

  if (!payrollSet) {
    return { error: "Payroll set not found." };
  }

  // Check if payroll set is assigned to any employees
  const { data: employees } = await supabase
    .from("employees")
    .select("id")
    .eq("payroll_set_id", payrollSetId)
    .limit(1);

  if (employees && employees.length > 0) {
    return { 
      error: "Cannot delete payroll set that has employees assigned. Please reassign employees first." 
    };
  }

  const { error } = await supabase
    .from("payroll_sets")
    .delete()
    .eq("id", payrollSetId);

  if (error) {
    return { error: "Failed to delete payroll set: " + error.message };
  }

  revalidatePath("/hr/admin/payroll-sets");
  return { success: "Payroll set deleted successfully." };
}