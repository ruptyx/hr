export const LEAVE_TYPES = [
  'Annual',
  'Sick',
  'Personal',
  'Maternity',
  'Paternity',
  'Emergency',
  'Bereavement',
  'Study',
  'Unpaid'
] as const

export const LEAVE_STATUSES = [
  'Pending',
  'Approved',
  'Rejected'
] as const

export type LeaveType = typeof LEAVE_TYPES[number]
export type LeaveStatus = typeof LEAVE_STATUSES[number]