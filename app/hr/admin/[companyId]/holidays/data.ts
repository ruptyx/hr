import { createClient } from '@/utils/supabase/server'

export interface Holiday {
  holiday_id: number
  holiday_date: string
  holiday_name: string
  company_id: number
  created_by: number
  created_date: string
  modified_by: number | null
  modified_date: string | null
}

export async function getHolidays(companyId: number): Promise<Holiday[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_holidays', {
    p_company_id: companyId
  })

  if (error) {
    console.error('Error fetching holidays:', error)
    throw new Error('Failed to fetch holidays')
  }

  return data || []
}

export async function getHolidayById(holidayId: number): Promise<Holiday | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_holiday_by_id', {
    p_holiday_id: holidayId
  })

  if (error) {
    console.error('Error fetching holiday:', error)
    throw new Error('Failed to fetch holiday')
  }

  return data?.[0] || null
}