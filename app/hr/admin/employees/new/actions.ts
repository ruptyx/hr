// /app/hr/admin/employees/new/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Define a schema for validation using Zod
const EmployeeSchema = z.object({
  nameEnglish: z.string().min(3, { message: "English name must be at least 3 characters." }),
  nameArabic: z.string().optional(),
  dob: z.coerce.date().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationality: z.string().optional(),
  mobileNumber: z.string().min(8, { message: "A valid mobile number is required." }),
  email: z.string().email("A valid email is required.").optional().or(z.literal('')),
  emergencyContactNumber: z.string().optional(),
  religion: z.string().optional(),
  bloodGroup: z.string().optional(),
  positionId: z.string().min(1, { message: "Position is required." }),
  joinDate: z.coerce.date(), // <-- CORRECTED
  salaryFlag: z.boolean(),
});

export type FormState = {
  message: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function createEmployee(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();

  // Extract and validate data from FormData
  const validatedFields = EmployeeSchema.safeParse({
    nameEnglish: formData.get('nameEnglish'),
    nameArabic: formData.get('nameArabic'),
    dob: formData.get('dob'),
    gender: formData.get('gender'),
    maritalStatus: formData.get('maritalStatus'),
    nationality: formData.get('nationality'),
    mobileNumber: formData.get('mobileNumber'),
    email: formData.get('email'),
    emergencyContactNumber: formData.get('emergencyContactNumber'),
    religion: formData.get('religion'),
    bloodGroup: formData.get('bloodGroup'),
    positionId: formData.get('positionId'),
    joinDate: formData.get('joinDate'),
    salaryFlag: formData.get('employmentType') === 'Salaried',
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      message: "Validation failed. Please check the fields below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Call the database RPC function with validated data
  const { data, error } = await supabase.rpc('create_new_employee', {
    p_name_english: validatedFields.data.nameEnglish,
    p_name_arabic: validatedFields.data.nameArabic,
    p_dob: validatedFields.data.dob?.toISOString(),
    p_gender: validatedFields.data.gender,
    p_marital_status: validatedFields.data.maritalStatus,
    p_nationality: validatedFields.data.nationality,
    p_mobile_number: validatedFields.data.mobileNumber,
    p_email: validatedFields.data.email,
    p_emergency_contact_number: validatedFields.data.emergencyContactNumber,
    p_religion: validatedFields.data.religion,
    p_blood_group: validatedFields.data.bloodGroup,
    p_position_id: parseInt(validatedFields.data.positionId),
    p_join_date: validatedFields.data.joinDate.toISOString(),
    p_salary_flag: validatedFields.data.salaryFlag,
  });

  if (error || data?.status === 'error') {
    console.error('Database Error:', error || data?.message);
    return { message: `Database Error: Failed to create employee profile.` };
  }

  // On success, redirect to a relevant page
  redirect('/hr/admin');
}