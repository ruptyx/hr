// /app/hr/admin/departments/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { departmentSchema, deleteDepartmentSchema } from "./schemas";
import { departmentHasChildren } from "./data";

export async function addDepartment(formData: FormData) {
  const supabase = await createClient();

  const rawData: any = {
    name: formData.get("name"),
  };

  // Only include parent_department_id if it was provided
  const parentId = formData.get("parent_department_id");
  if (parentId) {
    rawData.parent_department_id = parentId;
  }

  const validatedFields = departmentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, parent_department_id } = validatedFields.data;

  // Validate parent department exists if provided
  if (parent_department_id) {
    const { data: parentExists } = await supabase
      .from("departments")
      .select("id")
      .eq("id", parent_department_id)
      .single();

    if (!parentExists) {
      return { error: "Selected parent department does not exist." };
    }
  }

  const { error } = await supabase.from("departments").insert({
    name,
    parent_department_id: parent_department_id || null,
  });

  if (error) {
    return { error: "Failed to add department: " + error.message };
  }

  revalidatePath("/hr/admin/departments");
  return { success: "Department added successfully." };
}

export async function updateDepartment(
  departmentId: string,
  formData: FormData
) {
  const supabase = await createClient();

  // Validate department ID
  const idValidation = deleteDepartmentSchema.safeParse({ id: departmentId });
  if (!idValidation.success) {
    return { error: "Invalid department ID." };
  }

  const rawData: any = {
    name: formData.get("name"),
  };

  // Only include parent_department_id if it was provided
  const parentId = formData.get("parent_department_id");
  if (parentId) {
    rawData.parent_department_id = parentId;
  }

  const validatedFields = departmentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, parent_department_id } = validatedFields.data;

  // Prevent setting self as parent or creating circular references
  if (parent_department_id === departmentId) {
    return { error: "A department cannot be its own parent." };
  }

  // Validate parent department exists if provided
  if (parent_department_id) {
    const { data: parentExists } = await supabase
      .from("departments")
      .select("id")
      .eq("id", parent_department_id)
      .single();

    if (!parentExists) {
      return { error: "Selected parent department does not exist." };
    }

    // Check for circular reference using RPC function
    const { data: wouldCreateCycle } = await supabase.rpc('check_department_cycle', {
      dept_id: departmentId,
      new_parent_id: parent_department_id
    });

    if (wouldCreateCycle) {
      return { error: "This would create a circular reference in the department hierarchy." };
    }
  }

  const { error } = await supabase
    .from("departments")
    .update({
      name,
      parent_department_id: parent_department_id || null,
    })
    .eq("id", departmentId);

  if (error) {
    return { error: "Failed to update department: " + error.message };
  }

  revalidatePath("/hr/admin/departments");
  return { success: "Department updated successfully." };
}

export async function deleteDepartment(departmentId: string) {
  const supabase = await createClient();

  // Validate department ID
  const idValidation = deleteDepartmentSchema.safeParse({ id: departmentId });
  if (!idValidation.success) {
    return { error: "Invalid department ID." };
  }

  // Check if department exists
  const { data: department } = await supabase
    .from("departments")
    .select("id, name")
    .eq("id", departmentId)
    .single();

  if (!department) {
    return { error: "Department not found." };
  }

  // Check if department has children
  const hasChildren = await departmentHasChildren(departmentId);
  if (hasChildren) {
    return { 
      error: "Cannot delete department with sub-departments. Please reassign or delete them first." 
    };
  }

  // Check if department is assigned to any employees
  const { data: employees } = await supabase
    .from("employees")
    .select("id")
    .eq("department_id", departmentId)
    .limit(1);

  if (employees && employees.length > 0) {
    return { 
      error: "Cannot delete department that has employees assigned. Please reassign employees first." 
    };
  }

  const { error } = await supabase
    .from("departments")
    .delete()
    .eq("id", departmentId);

  if (error) {
    return { error: "Failed to delete department: " + error.message };
  }

  revalidatePath("/hr/admin/departments");
  return { success: "Department deleted successfully." };
}