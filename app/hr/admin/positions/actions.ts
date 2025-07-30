// /app/hr/admin/position-types/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const getPositionTypeDataFromFormData = (formData: FormData) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  return {
    title,
    description,
    created_by: "admin", // Placeholder
    modified_by: "admin", // Placeholder
  };
};

export async function addPositionType(formData: FormData) {
  const supabase = await createClient();
  const positionTypeData = getPositionTypeDataFromFormData(formData);

  if (!positionTypeData.title) {
    return { error: "Position title is required." };
  }

  const { error } = await supabase.from("position_type").insert(positionTypeData);

  if (error) {
    console.error("Error adding position type:", error);
    return { error: "Failed to add position type. " + error.message };
  }

  revalidatePath("/hr/admin/positions");
  return { success: "Position type added successfully." };
}

export async function updatePositionType(positionTypeId: number, formData: FormData) {
    const supabase = await createClient();
    const positionTypeData = getPositionTypeDataFromFormData(formData);

    if (!positionTypeData.title) {
        return { error: "Position title is required." };
    }

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
}


export async function deletePositionType(positionTypeId: number) {
    const supabase = await createClient();

    const { data: positions } = await supabase.from('position').select('position_id').eq('position_type_id', positionTypeId).limit(1);

    if (positions && positions.length > 0) {
        return { error: "Cannot delete a position type that is currently in use by a position." };
    }

    const { error } = await supabase.from("position_type").delete().eq("position_type_id", positionTypeId);

    if (error) {
        console.error("Error deleting position type:", error);
        return { error: "Failed to delete position type. " + error.message };
    }

    revalidatePath("/hr/admin/positions");
    return { success: "Position type deleted successfully." };
}
