"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { salaryComponentSchema } from "./schemas";

const getSalaryComponentDataFromFormData = (formData: FormData) => {
  const validatedFields = salaryComponentSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    is_taxable: formData.get("is_taxable") === "on",
    is_basic_salary: formData.get("is_basic_salary") === "on",
    display_order: formData.get("display_order"),
    main_account_code: formData.get("main_account_code"),
    dimension_1: formData.get("dimension_1"),
    dimension_2: formData.get("dimension_2"),
    dimension_3: formData.get("dimension_3"),
    dimension_4: formData.get("dimension_4"),
    dimension_5: formData.get("dimension_5"),
  });

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  return {
    ...validatedFields.data,
    created_by: "admin", // Placeholder
    modified_by: "admin", // Placeholder
  };
};

export async function addSalaryComponentType(formData: FormData) {
  const supabase = await createClient();
  try {
    const componentData = getSalaryComponentDataFromFormData(formData);

    const { error } = await supabase
      .from("salary_component_type")
      .insert(componentData);

    if (error) {
      console.error("Error adding salary component type:", error);
      return { error: "Failed to add component. " + error.message };
    }

    revalidatePath("/hr/admin/salary-components");
    return { success: "Salary component added successfully." };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateSalaryComponentType(
  componentTypeId: number,
  formData: FormData
) {
  const supabase = await createClient();
  try {
    const componentData = getSalaryComponentDataFromFormData(formData);

    const { error } = await supabase
      .from("salary_component_type")
      .update(componentData)
      .eq("component_type_id", componentTypeId);

    if (error) {
      console.error("Error updating salary component type:", error);
      return { error: "Failed to update component. " + error.message };
    }

    revalidatePath("/hr/admin/salary-components");
    return { success: "Salary component updated successfully." };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteSalaryComponentType(componentTypeId: number) {
  const supabase = await createClient();

  const { data: components } = await supabase
    .from("compensation_component")
    .select("compensation_component_id")
    .eq("component_type_id", componentTypeId)
    .limit(1);

  if (components && components.length > 0) {
    return { error: "Cannot delete a component type that is in use." };
  }

  const { error } = await supabase
    .from("salary_component_type")
    .delete()
    .eq("component_type_id", componentTypeId);

  if (error) {
    console.error("Error deleting salary component type:", error);
    return { error: "Failed to delete component. " + error.message };
  }

  revalidatePath("/hr/admin/salary-components");
  return { success: "Salary component deleted successfully." };
}