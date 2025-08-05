export function LeaveRequestsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Leave Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage employee leave requests and approvals
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Future: Add bulk actions, export, or filter buttons here */}
      </div>
    </div>
  )
}