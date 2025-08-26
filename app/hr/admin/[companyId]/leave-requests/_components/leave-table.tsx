import { LeaveRequest } from '../data'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LeaveRequestRow } from './leave-row'

interface LeaveRequestsTableProps {
  leaveRequests: LeaveRequest[]
}

export function LeaveRequestsTable({ leaveRequests }: LeaveRequestsTableProps) {
  if (leaveRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">🏖️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests found</h3>
          <p className="text-sm">Submit your first leave request above to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Employee
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Leave Type
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Duration
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Days
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Status
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Approver
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Submitted
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.map((request) => (
            <LeaveRequestRow 
              key={request.request_id} 
              leaveRequest={request} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}