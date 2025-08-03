"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { payrollSetSchema, type PayrollSetInput } from "./schemas";

// Result types for server actions
export type ActionResult = {
  success?: string;
  error?: string;
};

/**
 * A helper function to parse and validate payroll set data from a FormData object.
 * @param formData The FormData object from the form submission.
 * @returns A validated data object for database insertion/update.
 */
const getPayrollSetDataFromFormData = (formData: FormData): PayrollSetInput => {
  // The 'is_active' checkbox will have the value 'on' if checked, and will be absent if not.
  const isActive = formData.get("is_active") === "on";
  
  // Get company_party_id and convert to number
  const companyPartyIdValue = formData.get("company_party_id");
  const companyPartyId = companyPartyIdValue ? Number(companyPartyIdValue) : undefined;

  const validatedFields = payrollSetSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    company_party_id: companyPartyId,
    is_active: isActive,
  });

  // If validation fails, throw an error with the details.
  if (!validatedFields.success) {
    const errorMessages = Object.entries(validatedFields.error.flatten().fieldErrors)
      .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
      .join('; ');
    throw new Error(`Validation failed: ${errorMessages}`);
  }

  // Return the validated data, ready for the database.
  return validatedFields.data;
};

/**
 * Server Action to add a new payroll set to the database.
 * @param formData The form data for the new payroll set.
 */
export async function addPayrollSet(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  
  try {
    const payrollSetData = getPayrollSetDataFromFormData(formData);

    const { error } = await supabase
      .from("payroll_set")
      .insert({
        name: payrollSetData.name,
        description: payrollSetData.description,
        company_party_id: payrollSetData.company_party_id,
        is_active: payrollSetData.is_active,
      });

    if (error) {
      console.error("Error adding payroll set:", error);
      return { error: `Failed to add payroll set: ${error.message}` };
    }

    // Revalidate the path to refresh the data on the page.
    revalidatePath("/payroll/admin/payroll-sets");
    return { success: "Payroll set added successfully." };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred";
    console.error("Error in addPayrollSet:", errorMessage);
    return { error: errorMessage };
  }
}

/**
 * Server Action to update an existing payroll set.
 * @param payrollSetId The ID of the payroll set to update.
 * @param formData The new data for the payroll set.
 */
export async function updatePayrollSet(
  payrollSetId: number,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  
  try {
    // Validate payroll set ID
    if (!Number.isInteger(payrollSetId) || payrollSetId <= 0) {
      return { error: "Invalid payroll set ID." };
    }

    const payrollSetData = getPayrollSetDataFromFormData(formData);

    const { error } = await supabase
      .from("payroll_set")
      .update({
        name: payrollSetData.name,
        description: payrollSetData.description,
        company_party_id: payrollSetData.company_party_id,
        is_active: payrollSetData.is_active,
      })
      .eq("payroll_set_id", payrollSetId);

    if (error) {
      console.error("Error updating payroll set:", error);
      return { error: `Failed to update payroll set: ${error.message}` };
    }

    revalidatePath("/payroll/admin/payroll-sets");
    return { success: "Payroll set updated successfully." };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred";
    console.error("Error in updatePayrollSet:", errorMessage);
    return { error: errorMessage };
  }
}

/**
 * Server Action to delete a payroll set.
 * @param payrollSetId The ID of the payroll set to delete.
 */
export async function deletePayrollSet(payrollSetId: number): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    // Validate payroll set ID
    if (!Number.isInteger(payrollSetId) || payrollSetId <= 0) {
      return { error: "Invalid payroll set ID." };
    }

    // IMPORTANT: Before deleting, you might want to check if this payroll set
    // is being used in any payroll runs or other related tables to prevent orphaned records.
    // Example implementation:
    // const { data: relatedData, error: checkError } = await supabase
    //   .from('payroll_run')
    //   .select('id')
    //   .eq('payroll_set_id', payrollSetId)
    //   .limit(1);
    // 
    // if (checkError) {
    //   console.error("Error checking for related records:", checkError);
    //   return { error: "Failed to verify if payroll set can be deleted." };
    // }
    // 
    // if (relatedData && relatedData.length > 0) {
    //   return { error: "Cannot delete a payroll set that is in use." };
    // }

    const { error } = await supabase
      .from("payroll_set")
      .delete()
      .eq("payroll_set_id", payrollSetId);

    if (error) {
      console.error("Error deleting payroll set:", error);
      return { error: `Failed to delete payroll set: ${error.message}` };
    }

    revalidatePath("/payroll/admin/payroll-sets");
    return { success: "Payroll set deleted successfully." };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred";
    console.error("Error in deletePayrollSet:", errorMessage);
    return { error: errorMessage };
  }
}