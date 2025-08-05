import { createClient } from '@/utils/supabase/server'

export interface Department {
  department_id: number
  department_name: string
  company_id: number
  created_by: number
  created_date: string
  modified_by: number | null
  modified_date: string | null
  parent_id: number | null
  parent_name?: string | null
}

export async function getDepartments(companyId: number): Promise<Department[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_departments', {
    p_company_id: companyId
  })

  if (error) {
    console.error('Error fetching departments:', error)
    throw new Error('Failed to fetch departments')
  }

  return data || []
}

export async function getDepartmentById(departmentId: number): Promise<Department | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_department_by_id', {
    p_department_id: departmentId
  })

  if (error) {
    console.error('Error fetching department:', error)
    throw new Error('Failed to fetch department')
  }

  return data?.[0] || null
}