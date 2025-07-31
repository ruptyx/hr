"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { positionSchema } from "./schemas";

const getPositionTypeDataFromFormData = (formData: FormData) => {
  const validatedFields = positionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
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

export async function addPositionType(formData: FormData) {
  const supabase = await createClient();
  try {
    const positionTypeData = getPositionTypeDataFromFormData(formData);

    const { error } = await supabase
      .from("position_type")
      .insert(positionTypeData);

    if (error) {
      console.error("Error adding position type:", error);
      return { error: "Failed to add position type. " + error.message };
    }

    revalidatePath("/hr/admin/positions");
    return { success: "Position type added successfully." };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updatePositionType(
  positionTypeId: number,
  formData: FormData
) {
  const supabase = await createClient();
  try {
    const positionTypeData = getPositionTypeDataFromFormData(formData);

    const { error } = await supabase
      .from("position_type")
      .update(positionTypeData)
      .eq("position_type_id", positionTypeId);

    if (error) {
      console.error("Error updating position type:", error);
      return { error: "Failed to update position type. " + error.message };
    }

    revalidatePath("/hr/admin/positions");
    return { success: "Position type updated successfully." };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deletePositionType(positionTypeId: number) {
  const supabase = await createClient();

  const { data: positions } = await supabase
    .from("position")
    .select("position_id")
    .eq("position_type_id", positionTypeId)
    .limit(1);

  if (positions && positions.length > 0) {
    return {
      error: "Cannot delete a position type that is currently in use by a position.",
    };
  }

  const { error } = await supabase
    .from("position_type")
    .delete()
    .eq("position_type_id", positionTypeId);

  if (error) {
    console.error("Error deleting position type:", error);
    return { error: "Failed to delete position type. " + error.message };
  }

  revalidatePath("/hr/admin/positions");
  return { success: "Position type deleted successfully." };
}