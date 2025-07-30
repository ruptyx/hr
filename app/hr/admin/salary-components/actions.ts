// /app/hr/admin/salary-components/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const getSalaryComponentDataFromFormData = (formData: FormData) => {
  const displayOrder = formData.get("display_order") as string;
  return {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    is_taxable: formData.get("is_taxable") === "on",
    is_basic_salary: formData.get("is_basic_salary") === "on",
    display_order: displayOrder ? parseInt(displayOrder) : 0,
    main_account_code: formData.get("main_account_code") as string,
    dimension_1: formData.get("dimension_1") as string,
    dimension_2: formData.get("dimension_2") as string,
    dimension_3: formData.get("dimension_3") as string,
    dimension_4: formData.get("dimension_4") as string,
    dimension_5: formData.get("dimension_5") as string,
    created_by: "admin", // Placeholder
    modified_by: "admin", // Placeholder
  };
};

export async function addSalaryComponentType(formData: FormData) {
  const supabase = await createClient();
  const componentData = getSalaryComponentDataFromFormData(formData);

  if (!componentData.name) {
    return { error: "Component name is required." };
  }

  const { error } = await supabase.from("salary_component_type").insert(componentData);

  if (error) {
    console.error("Error adding salary component type:", error);
    return { error: "Failed to add component. " + error.message };
  }

  revalidatePath("/hr/admin/salary-components");
  return { success: "Salary component added successfully." };
}

export async function updateSalaryComponentType(componentTypeId: number, formData: FormData) {
    const supabase = await createClient();
    const componentData = getSalaryComponentDataFromFormData(formData);

    if (!componentData.name) {
        return { error: "Component name is required." };
    }

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
}


export async function deleteSalaryComponentType(componentTypeId: number) {
    const supabase = await createClient();

    const { data: components } = await supabase.from('compensation_component').select('compensation_component_id').eq('component_type_id', componentTypeId).limit(1);

    if (components && components.length > 0) {
        return { error: "Cannot delete a component type that is in use." };
    }

    const { error } = await supabase.from("salary_component_type").delete().eq("component_type_id", componentTypeId);

    if (error) {
        console.error("Error deleting salary component type:", error);
        return { error: "Failed to delete component. " + error.message };
    }

    revalidatePath("/hr/admin/salary-components");
    return { success: "Salary component deleted successfully." };
}
