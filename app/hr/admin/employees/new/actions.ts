// /app/hr/admin/employees/new/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

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
  departmentId: z.string().min(1, { message: "Department is required."}),
  positionTypeId: z.string().min(1, { message: "Position Type is required." }),
  managerId: z.string().optional(), // New optional manager field
  joinDate: z.coerce.date(),
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
    departmentId: formData.get('departmentId'),
    positionTypeId: formData.get('positionTypeId'),
    managerId: formData.get('managerId'),
    joinDate: formData.get('joinDate'),
    salaryFlag: formData.get('employmentType') === 'Salaried',
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check the fields below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase.rpc('create_employee_with_new_position', {
    p_name_english: validatedFields.data.nameEnglish,
    p_join_date: validatedFields.data.joinDate.toISOString(),
    p_department_id: parseInt(validatedFields.data.departmentId),
    p_position_type_id: parseInt(validatedFields.data.positionTypeId),
    p_manager_party_id: validatedFields.data.managerId ? parseInt(validatedFields.data.managerId) : null,
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
    p_salary_flag: validatedFields.data.salaryFlag,
  });

  if (error || data?.status === 'error') {
    console.error('Database Error:', error || data?.message);
    return { message: `Database Error: Failed to create employee. ${data?.message || ''}` };
  }

  redirect('/hr/admin');
}
