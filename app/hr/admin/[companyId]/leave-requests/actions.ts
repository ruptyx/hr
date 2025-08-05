'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLeaveRequest(formData: FormData) {
  const supabase = await createClient()
  
  const employeeId = parseInt(formData.get('employee_id') as string)
  const leaveType = formData.get('leave_type') as string
  const startDate = formData.get('start_date') as string
  const endDate = formData.get('end_date') as string
  const remarks = formData.get('remarks') as string
  const companyId = parseInt(formData.get('company_id') as string)
  const createdBy = 1 // TODO: Get from session/auth context

  if (!employeeId || !leaveType || !startDate || !endDate || !companyId) {
    throw new Error('Employee, leave type, dates, and company ID are required')
  }

  // Validate date range
  if (new Date(startDate) > new Date(endDate)) {
    throw new Error('Start date cannot be after end date')
  }

  const { error } = await supabase.rpc('create_leave_request', {
    p_employee_id: employeeId,
    p_leave_type: leaveType,
    p_start_date: startDate,
    p_end_date: endDate,
    p_remarks: remarks || null,
    p_company_id: companyId,
    p_created_by: createdBy
  })

  if (error) {
    console.error('Error creating leave request:', error)
    throw new Error('Failed to create leave request')
  }

  revalidatePath(`/hr/admin/${companyId}/leave-requests`)
}

export async function updateLeaveRequest(formData: FormData) {
  const supabase = await createClient()
  
  const requestId = parseInt(formData.get('request_id') as string)
  const employeeId = parseInt(formData.get('employee_id') as string)
  const leaveType = formData.get('leave_type') as string
  const startDate = formData.get('start_date') as string
  const endDate = formData.get('end_date') as string
  const remarks = formData.get('remarks') as string
  const companyId = parseInt(formData.get('company_id') as string)
  const modifiedBy = 1 // TODO: Get from session/auth context

  if (!requestId || !employeeId || !leaveType || !startDate || !endDate) {
    throw new Error('All fields are required')
  }

  // Validate date range
  if (new Date(startDate) > new Date(endDate)) {
    throw new Error('Start date cannot be after end date')
  }

  const { error } = await supabase.rpc('update_leave_request', {
    p_request_id: requestId,
    p_employee_id: employeeId,
    p_leave_type: leaveType,
    p_start_date: startDate,
    p_end_date: endDate,
    p_remarks: remarks || null,
    p_modified_by: modifiedBy
  })

  if (error) {
    console.error('Error updating leave request:', error)
    throw new Error('Failed to update leave request')
  }

  revalidatePath(`/hr/admin/${companyId}/leave-requests`)
}

export async function approveLeaveRequest(formData: FormData) {
  const supabase = await createClient()
  
  const requestId = parseInt(formData.get('request_id') as string)
  const companyId = parseInt(formData.get('company_id') as string)
  const approverId = 1 // TODO: Get from session/auth context

  if (!requestId) {
    throw new Error('Request ID is required')
  }

  const { error } = await supabase.rpc('approve_leave_request', {
    p_request_id: requestId,
    p_approver_id: approverId
  })

  if (error) {
    console.error('Error approving leave request:', error)
    throw new Error('Failed to approve leave request')
  }

  revalidatePath(`/hr/admin/${companyId}/leave-requests`)
}

export async function rejectLeaveRequest(formData: FormData) {
  const supabase = await createClient()
  
  const requestId = parseInt(formData.get('request_id') as string)
  const companyId = parseInt(formData.get('company_id') as string)
  const approverId = 1 // TODO: Get from session/auth context

  if (!requestId) {
    throw new Error('Request ID is required')
  }

  const { error } = await supabase.rpc('reject_leave_request', {
    p_request_id: requestId,
    p_approver_id: approverId
  })

  if (error) {
    console.error('Error rejecting leave request:', error)
    throw new Error('Failed to reject leave request')
  }

  revalidatePath(`/hr/admin/${companyId}/leave-requests`)
}

export async function deleteLeaveRequest(formData: FormData) {
  const supabase = await createClient()
  
  const requestId = parseInt(formData.get('request_id') as string)
  const companyId = parseInt(formData.get('company_id') as string)

  if (!requestId) {
    throw new Error('Request ID is required')
  }

  const { error } = await supabase.rpc('delete_leave_request', {
    p_request_id: requestId
  })

  if (error) {
    console.error('Error deleting leave request:', error)
    throw new Error('Failed to delete leave request')
  }

  revalidatePath(`/hr/admin/${companyId}/leave-requests`)
}