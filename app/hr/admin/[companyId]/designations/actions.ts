'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDesignation(formData: FormData) {
  const supabase = await createClient()
  
  const designationTitle = formData.get('designation_title') as string
  const companyId = parseInt(formData.get('company_id') as string)
  const createdBy = 1 // TODO: Get from session/auth context

  if (!designationTitle || !companyId) {
    throw new Error('Designation title and company ID are required')
  }

  const { error } = await supabase.rpc('create_designation', {
    p_designation_title: designationTitle,
    p_company_id: companyId,
    p_created_by: createdBy
  })

  if (error) {
    console.error('Error creating designation:', error)
    throw new Error('Failed to create designation')
  }

  revalidatePath(`/hr/admin/${companyId}/designations`)
}

export async function updateDesignation(formData: FormData) {
  const supabase = await createClient()
  
  const designationId = parseInt(formData.get('designation_id') as string)
  const designationTitle = formData.get('designation_title') as string
  const companyId = parseInt(formData.get('company_id') as string)
  const modifiedBy = 1 // TODO: Get from session/auth context

  if (!designationId || !designationTitle) {
    throw new Error('Designation ID and title are required')
  }

  const { error } = await supabase.rpc('update_designation', {
    p_designation_id: designationId,
    p_designation_title: designationTitle,
    p_modified_by: modifiedBy
  })

  if (error) {
    console.error('Error updating designation:', error)
    throw new Error('Failed to update designation')
  }

  revalidatePath(`/hr/admin/${companyId}/designations`)
}

export async function deleteDesignation(formData: FormData) {
  const supabase = await createClient()
  
  const designationId = parseInt(formData.get('designation_id') as string)
  const companyId = parseInt(formData.get('company_id') as string)

  if (!designationId) {
    throw new Error('Designation ID is required')
  }

  const { error } = await supabase.rpc('delete_designation', {
    p_designation_id: designationId
  })

  if (error) {
    console.error('Error deleting designation:', error)
    throw new Error('Failed to delete designation')
  }

  revalidatePath(`/hr/admin/${companyId}/designations`)
}