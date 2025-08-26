import { createClient } from '@/utils/supabase/server'

export interface Designation {
  designation_id: number
  designation_title: string
  company_id: number
  created_by: number
  created_date: string
  modified_by: number | null
  modified_date: string | null
}

export async function getDesignations(companyId: number): Promise<Designation[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_designations', {
    p_company_id: companyId
  })

  if (error) {
    console.error('Error fetching designations:', error)
    throw new Error('Failed to fetch designations')
  }

  return data || []
}

export async function getDesignationById(designationId: number): Promise<Designation | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_designation_by_id', {
    p_designation_id: designationId
  })

  if (error) {
    console.error('Error fetching designation:', error)
    throw new Error('Failed to fetch designation')
  }

  return data?.[0] || null
}