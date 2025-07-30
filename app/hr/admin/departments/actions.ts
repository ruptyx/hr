// /app/hr/admin/departments/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addDepartment(formData: FormData) {
  const supabase = await createClient();
  const departmentName = formData.get("department_name") as string;
  const parentDepartmentId = formData.get("parent_department_id") as string;

  if (!departmentName) {
    return { error: "Department name is required." };
  }

  const { error } = await supabase.from("department").insert({
    department_name: departmentName,
    // Supabase handles empty string as null for integer fields
    parent_department_id: parentDepartmentId ? parseInt(parentDepartmentId) : null, 
    created_by: 'admin' // Placeholder, replace with actual user logic
  });

  if (error) {
    console.error("Error adding department:", error);
    return { error: "Failed to add department. " + error.message };
  }

  revalidatePath("/hr/admin/departments");
  return { success: "Department added successfully." };
}

export async function updateDepartment(departmentId: number, formData: FormData) {
    const supabase = await createClient();
    const departmentName = formData.get("department_name") as string;
    const parentDepartmentId = formData.get("parent_department_id") as string;

    if (!departmentName) {
        return { error: "Department name is required." };
    }

    const { error } = await supabase
        .from("department")
        .update({
            department_name: departmentName,
            parent_department_id: parentDepartmentId ? parseInt(parentDepartmentId) : null,
            modified_by: 'admin' // Placeholder
        })
        .eq("department_id", departmentId);

    if (error) {
        console.error("Error updating department:", error);
        return { error: "Failed to update department. " + error.message };
    }

    revalidatePath("/hr/admin/departments");
    return { success: "Department updated successfully." };
}


export async function deleteDepartment(departmentId: number) {
    const supabase = await createClient();

    // Optional: Check if department has child departments before deleting
    const { data: children } = await supabase.from('department').select('department_id').eq('parent_department_id', departmentId).limit(1);

    if (children && children.length > 0) {
        return { error: "Cannot delete department with sub-departments. Please reassign them first." };
    }

    const { error } = await supabase.from("department").delete().eq("department_id", departmentId);

    if (error) {
        console.error("Error deleting department:", error);
        return { error: "Failed to delete department. " + error.message };
    }

    revalidatePath("/hr/admin/departments");
    return { success: "Department deleted successfully." };
}
