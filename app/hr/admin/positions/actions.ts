// /app/hr/admin/designations/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { designationSchema, deleteDesignationSchema } from "./schemas";

export async function addDesignation(formData: FormData) {
  const supabase = await createClient();

  const validatedFields = designationSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name } = validatedFields.data;

  // Check if designation with same name already exists
  const { data: existingDesignation } = await supabase
    .from("designations")
    .select("id")
    .ilike("name", name)
    .single();

  if (existingDesignation) {
    return { error: "A designation with this name already exists." };
  }

  const { error } = await supabase.from("designations").insert({
    name,
  });

  if (error) {
    return { error: "Failed to add designation: " + error.message };
  }

  revalidatePath("/hr/admin/designations");
  return { success: "Designation added successfully." };
}

export async function updateDesignation(
  designationId: string,
  formData: FormData
) {
  const supabase = await createClient();

  // Validate designation ID
  const idValidation = deleteDesignationSchema.safeParse({ id: designationId });
  if (!idValidation.success) {
    return { error: "Invalid designation ID." };
  }

  const validatedFields = designationSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name } = validatedFields.data;

  // Check if designation exists
  const { data: designation } = await supabase
    .from("designations")
    .select("id, name")
    .eq("id", designationId)
    .single();

  if (!designation) {
    return { error: "Designation not found." };
  }

  // Check if another designation with same name already exists (excluding current one)
  const { data: existingDesignation } = await supabase
    .from("designations")
    .select("id")
    .ilike("name", name)
    .neq("id", designationId)
    .single();

  if (existingDesignation) {
    return { error: "A designation with this name already exists." };
  }

  const { error } = await supabase
    .from("designations")
    .update({ name })
    .eq("id", designationId);

  if (error) {
    return { error: "Failed to update designation: " + error.message };
  }

  revalidatePath("/hr/admin/designations");
  return { success: "Designation updated successfully." };
}

export async function deleteDesignation(designationId: string) {
  const supabase = await createClient();

  // Validate designation ID
  const idValidation = deleteDesignationSchema.safeParse({ id: designationId });
  if (!idValidation.success) {
    return { error: "Invalid designation ID." };
  }

  // Check if designation exists
  const { data: designation } = await supabase
    .from("designations")
    .select("id, name")
    .eq("id", designationId)
    .single();

  if (!designation) {
    return { error: "Designation not found." };
  }

  // Check if designation is assigned to any employees
  const { data: employees } = await supabase
    .from("employees")
    .select("id")
    .eq("designation_id", designationId)
    .limit(1);

  if (employees && employees.length > 0) {
    return { 
      error: "Cannot delete designation that has employees assigned. Please reassign employees first." 
    };
  }

  const { error } = await supabase
    .from("designations")
    .delete()
    .eq("id", designationId);

  if (error) {
    return { error: "Failed to delete designation: " + error.message };
  }

  revalidatePath("/hr/admin/designations");
  return { success: "Designation deleted successfully." };
}