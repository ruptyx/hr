import { AddLeaveRequestForm } from "./_components/add-leave"
import { LeaveRequestsHeader } from "./_components/leave-header"
import { LeaveRequestsStats } from "./_components/leave-stat"
import { LeaveRequestsTable } from "./_components/leave-table"
import { getLeaveRequests } from "./data"

interface PageProps {
  params: Promise<{
    companyId: string
  }>
}

export default async function LeaveRequestsPage({ params }: PageProps) {
  const { companyId } = await params
  const leaveRequests = await getLeaveRequests(parseInt(companyId))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <LeaveRequestsHeader />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8">
        <div className="space-y-6">
          {/* Stats Overview */}
          <LeaveRequestsStats leaveRequests={leaveRequests} />

          {/* Add Leave Request Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Submit New Leave Request</h2>
              <AddLeaveRequestForm companyId={parseInt(companyId)} />
            </div>
          </div>

          {/* Leave Requests Table Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">All Leave Requests</h2>
                <div className="text-sm text-gray-500">
                  {leaveRequests.length} request{leaveRequests.length !== 1 ? 's' : ''}
                </div>
              </div>
              <LeaveRequestsTable leaveRequests={leaveRequests} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}