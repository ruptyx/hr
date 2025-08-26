import { createClient } from '@/utils/supabase/server'
import { LEAVE_TYPES, LEAVE_STATUSES, LeaveType, LeaveStatus } from './constants'

export interface LeaveRequest {
  request_id: number
  employee_id: number
  employee_name?: string
  leave_type: string
  start_date: string
  end_date: string
  status: string
  approver_id: number | null
  approver_name?: string | null
  approval_date: string | null
  remarks: string | null
  company_id: number
  created_by: number
  created_date: string
  modified_by: number | null
  modified_date: string | null
  days_count?: number
}

export { LEAVE_TYPES, LEAVE_STATUSES, type LeaveType, type LeaveStatus }

export async function getLeaveRequests(companyId: number): Promise<LeaveRequest[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_leave_requests', {
    p_company_id: companyId
  })

  if (error) {
    console.error('Error fetching leave requests:', error)
    throw new Error('Failed to fetch leave requests')
  }

  return data || []
}

export async function getLeaveRequestById(requestId: number): Promise<LeaveRequest | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_leave_request_by_id', {
    p_request_id: requestId
  })

  if (error) {
    console.error('Error fetching leave request:', error)
    throw new Error('Failed to fetch leave request')
  }

  return data?.[0] || null
}

export async function getEmployeesForCompany(companyId: number) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_employees_for_leave', {
    p_company_id: companyId
  })

  if (error) {
    console.error('Error fetching employees:', error)
    throw new Error('Failed to fetch employees')
  }

  return data || []
}