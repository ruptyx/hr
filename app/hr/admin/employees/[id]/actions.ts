// /app/hr/admin/employees/[id]/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

export async function updateEmployee(partyId: number, formData: FormData) {
  const supabase = await createClient();

  const managerPartyIdValue = formData.get("manager_party_id") as string;

  const employeeData = {
    name_english: formData.get("name_english") as string,
    name_arabic: formData.get("name_arabic") as string,
    email: formData.get("email") as string,
    mobile_number: formData.get("mobile_number") as string,
    gender: formData.get("gender") as string,
    birth_date: formData.get("birth_date") as string || null,
    marital_status: formData.get("marital_status") as string,
    nationality: formData.get("nationality") as string,
    emergency_contact_number: formData.get("emergency_contact_number") as string,
    religion: formData.get("religion") as string,
    blood_group: formData.get("blood_group") as string,
    manager_party_id: managerPartyIdValue && managerPartyIdValue !== 'null' ? parseInt(managerPartyIdValue, 10) : null,
    modified_by: "admin", // Placeholder
  };

  if (!employeeData.name_english || !employeeData.mobile_number) {
    return { error: "Employee name and mobile number are required." };
  }

  const { error } = await supabase
    .from("employee")
    .update(employeeData)
    .eq("party_id", partyId);

  if (error) {
    console.error("Error updating employee:", error);
    return { error: "Failed to update employee. " + error.message };
  }

  revalidatePath(`/hr/admin/employees/${partyId}`);
  revalidatePath('/hr/admin/employees');
  
  return { success: "Employee details updated successfully." };
}

export async function saveCompensation(employeeId: number, compensationData: any) {
    const supabase = await createClient();

    // Use a database transaction (via RPC) to ensure atomicity
    const { error } = await supabase.rpc('save_employee_compensation', {
        p_employee_id: employeeId,
        p_total_amount: compensationData.total_amount,
        p_from_date: compensationData.from_date,
        p_components: compensationData.components
    });

    if (error) {
        console.error("Error saving compensation:", error);
        return { error: "Failed to save compensation. " + error.message };
    }

    revalidatePath(`/hr/admin/employees/${employeeId}`);
    return { success: "Compensation saved successfully." };
}
