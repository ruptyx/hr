import { createClient } from '@/utils/supabase/server'
import { PAY_FREQUENCIES, PayFrequency } from './constants'

export interface PayrollSet {
  payroll_set_id: number
  set_name: string
  pay_frequency: string
  last_run_date: string | null
  company_id: number
  created_by: number
  created_date: string
  modified_by: number | null
  modified_date: string | null
}

export { PAY_FREQUENCIES, type PayFrequency }

export async function getPayrollSets(companyId: number): Promise<PayrollSet[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_payroll_sets', {
    p_company_id: companyId
  })

  if (error) {
    console.error('Error fetching payroll sets:', error)
    throw new Error('Failed to fetch payroll sets')
  }

  return data || []
}

export async function getPayrollSetById(payrollSetId: number): Promise<PayrollSet | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_payroll_set_by_id', {
    p_payroll_set_id: payrollSetId
  })

  if (error) {
    console.error('Error fetching payroll set:', error)
    throw new Error('Failed to fetch payroll set')
  }

  return data?.[0] || null
}