import { LeaveRequest } from '../data'
import { Badge } from '@/components/ui/badge'

interface LeaveRequestsStatsProps {
  leaveRequests: LeaveRequest[]
}

export function LeaveRequestsStats({ leaveRequests }: LeaveRequestsStatsProps) {
  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(req => req.status === 'Pending').length,
    approved: leaveRequests.filter(req => req.status === 'Approved').length,
    rejected: leaveRequests.filter(req => req.status === 'Rejected').length,
  }

  const statCards = [
    {
      title: 'Total Requests',
      value: stats.total,
      color: 'bg-gray-50 text-gray-700 border-gray-200'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      title: 'Approved',
      value: stats.approved,
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      color: 'bg-red-50 text-red-700 border-red-200'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <Badge className={stat.color}>
              {stat.value}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}