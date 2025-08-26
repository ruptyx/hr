import { LeaveRequest } from '../data'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { LeaveRequestActions } from './leave-actions'

interface LeaveRequestRowProps {
  leaveRequest: LeaveRequest
}

export function LeaveRequestRow({ leaveRequest }: LeaveRequestRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end dates
    return diffDays
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'Approved':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const days = calculateDays(leaveRequest.start_date, leaveRequest.end_date)

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium text-gray-900">
        <div>
          <div>Employee #{leaveRequest.employee_id}</div>
          {leaveRequest.employee_name && (
            <div className="text-sm text-gray-500">{leaveRequest.employee_name}</div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-gray-600">
        {leaveRequest.leave_type}
      </TableCell>
      <TableCell className="text-gray-600 text-sm">
        <div>
          <div>{formatDate(leaveRequest.start_date)}</div>
          <div className="text-gray-400">to {formatDate(leaveRequest.end_date)}</div>
        </div>
      </TableCell>
      <TableCell className="text-gray-900 font-medium">
        {days} day{days !== 1 ? 's' : ''}
      </TableCell>
      <TableCell>
        <Badge className={getStatusStyle(leaveRequest.status)}>
          {leaveRequest.status}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {leaveRequest.approver_name ? (
          <div>
            <div>{leaveRequest.approver_name}</div>
            {leaveRequest.approval_date && (
              <div className="text-xs text-gray-400">
                {formatDate(leaveRequest.approval_date)}
              </div>
            )}
          </div>
        ) : (
          <span className="italic text-gray-400">Pending</span>
        )}
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {formatDate(leaveRequest.created_date)}
      </TableCell>
      <TableCell>
        <LeaveRequestActions leaveRequest={leaveRequest} />
      </TableCell>
    </TableRow>
  )
}