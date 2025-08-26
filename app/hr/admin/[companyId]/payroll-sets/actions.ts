'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPayrollSet(formData: FormData) {
  const supabase = await createClient()
  
  const setName = formData.get('set_name') as string
  const payFrequency = formData.get('pay_frequency') as string
  const companyId = parseInt(formData.get('company_id') as string)
  const createdBy = 1 // TODO: Get from session/auth context

  if (!setName || !payFrequency || !companyId) {
    throw new Error('Set name, pay frequency, and company ID are required')
  }

  const { error } = await supabase.rpc('create_payroll_set', {
    p_set_name: setName,
    p_pay_frequency: payFrequency,
    p_company_id: companyId,
    p_created_by: createdBy
  })

  if (error) {
    console.error('Error creating payroll set:', error)
    if (error.message.includes('duplicate key')) {
      throw new Error('A payroll set with this name already exists')
    }
    throw new Error('Failed to create payroll set')
  }

  revalidatePath(`/hr/admin/${companyId}/payroll-sets`)
}

export async function updatePayrollSet(formData: FormData) {
  const supabase = await createClient()
  
  const payrollSetId = parseInt(formData.get('payroll_set_id') as string)
  const setName = formData.get('set_name') as string
  const payFrequency = formData.get('pay_frequency') as string
  const lastRunDate = formData.get('last_run_date') as string
  const companyId = parseInt(formData.get('company_id') as string)
  const modifiedBy = 1 // TODO: Get from session/auth context

  if (!payrollSetId || !setName || !payFrequency) {
    throw new Error('Payroll set ID, name, and pay frequency are required')
  }

  const { error } = await supabase.rpc('update_payroll_set', {
    p_payroll_set_id: payrollSetId,
    p_set_name: setName,
    p_pay_frequency: payFrequency,
    p_last_run_date: lastRunDate || null,
    p_modified_by: modifiedBy
  })

  if (error) {
    console.error('Error updating payroll set:', error)
    if (error.message.includes('duplicate key')) {
      throw new Error('A payroll set with this name already exists')
    }
    throw new Error('Failed to update payroll set')
  }

  revalidatePath(`/hr/admin/${companyId}/payroll-sets`)
}

export async function deletePayrollSet(formData: FormData) {
  const supabase = await createClient()
  
  const payrollSetId = parseInt(formData.get('payroll_set_id') as string)
  const companyId = parseInt(formData.get('company_id') as string)

  if (!payrollSetId) {
    throw new Error('Payroll set ID is required')
  }

  const { error } = await supabase.rpc('delete_payroll_set', {
    p_payroll_set_id: payrollSetId
  })

  if (error) {
    console.error('Error deleting payroll set:', error)
    throw new Error('Failed to delete payroll set')
  }

  revalidatePath(`/hr/admin/${companyId}/payroll-sets`)
}

export async function updateLastRunDate(formData: FormData) {
  const supabase = await createClient()
  
  const payrollSetId = parseInt(formData.get('payroll_set_id') as string)
  const companyId = parseInt(formData.get('company_id') as string)
  const modifiedBy = 1 // TODO: Get from session/auth context

  if (!payrollSetId) {
    throw new Error('Payroll set ID is required')
  }

  const { error } = await supabase.rpc('update_payroll_last_run', {
    p_payroll_set_id: payrollSetId,
    p_modified_by: modifiedBy
  })

  if (error) {
    console.error('Error updating last run date:', error)
    throw new Error('Failed to update last run date')
  }

  revalidatePath(`/hr/admin/${companyId}/payroll-sets`)
}