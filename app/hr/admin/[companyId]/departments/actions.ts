'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDepartment(formData: FormData) {
  const supabase = await createClient()
  
  const departmentName = formData.get('department_name') as string
  const companyId = parseInt(formData.get('company_id') as string)
  const parentId = formData.get('parent_id') as string
  const createdBy = 1 // TODO: Get from session/auth context

  if (!departmentName || !companyId) {
    throw new Error('Department name and company ID are required')
  }

  const { error } = await supabase.rpc('create_department', {
    p_department_name: departmentName,
    p_company_id: companyId,
    p_parent_id: parentId && parentId !== 'none' ? parseInt(parentId) : null,
    p_created_by: createdBy
  })

  if (error) {
    console.error('Error creating department:', error)
    throw new Error('Failed to create department')
  }

  revalidatePath(`/hr/admin/${companyId}/departments`)
}

export async function updateDepartment(formData: FormData) {
  const supabase = await createClient()
  
  const departmentId = parseInt(formData.get('department_id') as string)
  const departmentName = formData.get('department_name') as string
  const companyId = parseInt(formData.get('company_id') as string)
  const parentId = formData.get('parent_id') as string
  const modifiedBy = 1 // TODO: Get from session/auth context

  if (!departmentId || !departmentName) {
    throw new Error('Department ID and name are required')
  }

  const { error } = await supabase.rpc('update_department', {
    p_department_id: departmentId,
    p_department_name: departmentName,
    p_parent_id: parentId && parentId !== 'none' ? parseInt(parentId) : null,
    p_modified_by: modifiedBy
  })

  if (error) {
    console.error('Error updating department:', error)
    throw new Error('Failed to update department')
  }

  revalidatePath(`/hr/admin/${companyId}/departments`)
}

export async function deleteDepartment(formData: FormData) {
  const supabase = await createClient()
  
  const departmentId = parseInt(formData.get('department_id') as string)
  const companyId = parseInt(formData.get('company_id') as string)

  if (!departmentId) {
    throw new Error('Department ID is required')
  }

  const { error } = await supabase.rpc('delete_department', {
    p_department_id: departmentId
  })

  if (error) {
    console.error('Error deleting department:', error)
    throw new Error('Failed to delete department')
  }

  revalidatePath(`/hr/admin/${companyId}/departments`)
}