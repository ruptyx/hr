// /app/hr/admin/salary-components/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { salaryComponentSchema, deleteSalaryComponentSchema } from "./schemas";

export async function addSalaryComponent(formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    name: formData.get("name"),
    name_arabic: formData.get("name_arabic"),
    type: formData.get("type"),
    computation_type: formData.get("computation_type"),
    calculation_method: formData.get("calculation_method"),
    main_account_code: formData.get("main_account_code"),
    is_active: formData.get("is_active") === "true",
  };

  const validatedFields = salaryComponentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { 
    name, 
    name_arabic, 
    type, 
    computation_type, 
    calculation_method, 
    main_account_code, 
    is_active 
  } = validatedFields.data;

  // Check if salary component with same name already exists
  const { data: existingComponent } = await supabase
    .from("salary_components")
    .select("id")
    .ilike("name", name)
    .single();

  if (existingComponent) {
    return { error: "A salary component with this name already exists." };
  }

  const { error } = await supabase.from("salary_components").insert({
    name,
    name_arabic,
    type,
    computation_type,
    calculation_method,
    main_account_code,
    is_active,
  });

  if (error) {
    return { error: "Failed to add salary component: " + error.message };
  }

  revalidatePath("/hr/admin/salary-components");
  return { success: "Salary component added successfully." };
}

export async function updateSalaryComponent(
  componentId: string,
  formData: FormData
) {
  const supabase = await createClient();

  // Validate component ID
  const idValidation = deleteSalaryComponentSchema.safeParse({ id: componentId });
  if (!idValidation.success) {
    return { error: "Invalid salary component ID." };
  }

  const rawData = {
    name: formData.get("name"),
    name_arabic: formData.get("name_arabic"),
    type: formData.get("type"),
    computation_type: formData.get("computation_type"),
    calculation_method: formData.get("calculation_method"),
    main_account_code: formData.get("main_account_code"),
    is_active: formData.get("is_active") === "true",
  };

  const validatedFields = salaryComponentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { 
    name, 
    name_arabic, 
    type, 
    computation_type, 
    calculation_method, 
    main_account_code, 
    is_active 
  } = validatedFields.data;

  // Check if component exists
  const { data: component } = await supabase
    .from("salary_components")
    .select("id, name")
    .eq("id", componentId)
    .single();

  if (!component) {
    return { error: "Salary component not found." };
  }

  // Check if another component with same name already exists (excluding current one)
  const { data: existingComponent } = await supabase
    .from("salary_components")
    .select("id")
    .ilike("name", name)
    .neq("id", componentId)
    .single();

  if (existingComponent) {
    return { error: "A salary component with this name already exists." };
  }

  const { error } = await supabase
    .from("salary_components")
    .update({
      name,
      name_arabic,
      type,
      computation_type,
      calculation_method,
      main_account_code,
      is_active,
    })
    .eq("id", componentId);

  if (error) {
    return { error: "Failed to update salary component: " + error.message };
  }

  revalidatePath("/hr/admin/salary-components");
  return { success: "Salary component updated successfully." };
}

export async function deleteSalaryComponent(componentId: string) {
  const supabase = await createClient();

  // Validate component ID
  const idValidation = deleteSalaryComponentSchema.safeParse({ id: componentId });
  if (!idValidation.success) {
    return { error: "Invalid salary component ID." };
  }

  // Check if component exists
  const { data: component } = await supabase
    .from("salary_components")
    .select("id, name")
    .eq("id", componentId)
    .single();

  if (!component) {
    return { error: "Salary component not found." };
  }

  // Check if component is referenced in other tables
  const checks = [
    // Check leave settings references
    { table: "leave_settings", fields: ["public_holiday_component_id", "rest_day_component_id", "pay_now_component_id", "advance_earning_component_id", "advance_deduction_component_id"] },
    // Check leave types references
    { table: "leave_types", fields: ["leave_payment_component_id", "encashment_payment_component_id"] },
    // Check indemnity schemes references
    { table: "indemnity_schemes", fields: ["earning_salary_component_id"] }
  ];

  for (const check of checks) {
    for (const field of check.fields) {
      const { data: references } = await supabase
        .from(check.table)
        .select("id")
        .eq(field, componentId)
        .limit(1);

      if (references && references.length > 0) {
        return { 
          error: `Cannot delete salary component that is referenced in ${check.table}. Please remove references first.` 
        };
      }
    }
  }

  const { error } = await supabase
    .from("salary_components")
    .delete()
    .eq("id", componentId);

  if (error) {
    return { error: "Failed to delete salary component: " + error.message };
  }

  revalidatePath("/hr/admin/salary-components");
  return { success: "Salary component deleted successfully." };
}