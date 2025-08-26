'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createHoliday(formData: FormData) {
  const supabase = await createClient()
  
  const holidayDate = formData.get('holiday_date') as string
  const holidayName = formData.get('holiday_name') as string
  const companyId = parseInt(formData.get('company_id') as string)
  const createdBy = 1 // TODO: Get from session/auth context

  if (!holidayDate || !holidayName || !companyId) {
    throw new Error('Holiday date, name, and company ID are required')
  }

  const { error } = await supabase.rpc('create_holiday', {
    p_holiday_date: holidayDate,
    p_holiday_name: holidayName,
    p_company_id: companyId,
    p_created_by: createdBy
  })

  if (error) {
    console.error('Error creating holiday:', error)
    if (error.message.includes('duplicate key')) {
      throw new Error('A holiday already exists on this date')
    }
    throw new Error('Failed to create holiday')
  }

  revalidatePath(`/hr/admin/${companyId}/holidays`)
}

export async function updateHoliday(formData: FormData) {
  const supabase = await createClient()
  
  const holidayId = parseInt(formData.get('holiday_id') as string)
  const holidayDate = formData.get('holiday_date') as string
  const holidayName = formData.get('holiday_name') as string
  const companyId = parseInt(formData.get('company_id') as string)
  const modifiedBy = 1 // TODO: Get from session/auth context

  if (!holidayId || !holidayDate || !holidayName) {
    throw new Error('Holiday ID, date, and name are required')
  }

  const { error } = await supabase.rpc('update_holiday', {
    p_holiday_id: holidayId,
    p_holiday_date: holidayDate,
    p_holiday_name: holidayName,
    p_modified_by: modifiedBy
  })

  if (error) {
    console.error('Error updating holiday:', error)
    if (error.message.includes('duplicate key')) {
      throw new Error('A holiday already exists on this date')
    }
    throw new Error('Failed to update holiday')
  }

  revalidatePath(`/hr/admin/${companyId}/holidays`)
}

export async function deleteHoliday(formData: FormData) {
  const supabase = await createClient()
  
  const holidayId = parseInt(formData.get('holiday_id') as string)
  const companyId = parseInt(formData.get('company_id') as string)

  if (!holidayId) {
    throw new Error('Holiday ID is required')
  }

  const { error } = await supabase.rpc('delete_holiday', {
    p_holiday_id: holidayId
  })

  if (error) {
    console.error('Error deleting holiday:', error)
    throw new Error('Failed to delete holiday')
  }

  revalidatePath(`/hr/admin/${companyId}/holidays`)
}