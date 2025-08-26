import { PayrollSet } from '../data'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PayrollSetActions } from './payroll-action'

interface PayrollSetRowProps {
  payrollSet: PayrollSet
}

export function PayrollSetRow({ payrollSet }: PayrollSetRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getNextPayDate = (frequency: string, lastRunDate: string | null) => {
    if (!lastRunDate) return null
    
    const lastRun = new Date(lastRunDate)
    const nextPay = new Date(lastRun)
    
    switch (frequency) {
      case 'Weekly':
        nextPay.setDate(lastRun.getDate() + 7)
        break
      case 'Bi-weekly':
        nextPay.setDate(lastRun.getDate() + 14)
        break
      case 'Semi-monthly':
        nextPay.setDate(lastRun.getDate() + 15)
        break
      case 'Monthly':
        nextPay.setMonth(lastRun.getMonth() + 1)
        break
      case 'Quarterly':
        nextPay.setMonth(lastRun.getMonth() + 3)
        break
      case 'Annually':
        nextPay.setFullYear(lastRun.getFullYear() + 1)
        break
      default:
        return null
    }
    
    return nextPay
  }

  const getPayrollStatus = (lastRunDate: string | null, frequency: string) => {
    if (!lastRunDate) {
      return { status: 'Never Run', variant: 'secondary' as const, color: 'bg-gray-50 text-gray-600 border-gray-200' }
    }
    
    const nextPayDate = getNextPayDate(frequency, lastRunDate)
    if (!nextPayDate) {
      return { status: 'Unknown', variant: 'secondary' as const, color: 'bg-gray-50 text-gray-600 border-gray-200' }
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    nextPayDate.setHours(0, 0, 0, 0)
    
    const daysUntilNext = Math.ceil((nextPayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilNext < 0) {
      return { status: 'Overdue', variant: 'destructive' as const, color: 'bg-red-50 text-red-700 border-red-200' }
    } else if (daysUntilNext <= 3) {
      return { status: 'Due Soon', variant: 'secondary' as const, color: 'bg-orange-50 text-orange-700 border-orange-200' }
    } else if (daysUntilNext <= 7) {
      return { status: 'Upcoming', variant: 'secondary' as const, color: 'bg-blue-50 text-blue-700 border-blue-200' }
    } else {
      return { status: 'On Schedule', variant: 'secondary' as const, color: 'bg-green-50 text-green-700 border-green-200' }
    }
  }

  const statusInfo = getPayrollStatus(payrollSet.last_run_date, payrollSet.pay_frequency)

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium text-gray-900">
        {payrollSet.set_name}
      </TableCell>
      <TableCell className="text-gray-600">
        {payrollSet.pay_frequency}
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {payrollSet.last_run_date ? (
          <div>
            <div>{formatDate(payrollSet.last_run_date)}</div>
            {getNextPayDate(payrollSet.pay_frequency, payrollSet.last_run_date) && (
              <div className="text-xs text-gray-400">
                Next: {formatDate(getNextPayDate(payrollSet.pay_frequency, payrollSet.last_run_date)!.toISOString())}
              </div>
            )}
          </div>
        ) : (
          <span className="italic text-gray-400">Never run</span>
        )}
      </TableCell>
      <TableCell>
        <Badge className={statusInfo.color}>
          {statusInfo.status}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {formatDate(payrollSet.created_date)}
      </TableCell>
      <TableCell>
        <PayrollSetActions payrollSet={payrollSet} />
      </TableCell>
    </TableRow>
  )
}