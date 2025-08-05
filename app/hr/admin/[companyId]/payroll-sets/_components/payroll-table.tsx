import { PayrollSet } from '../data'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PayrollSetRow } from './payroll-row'

interface PayrollSetsTableProps {
  payrollSets: PayrollSet[]
}

export function PayrollSetsTable({ payrollSets }: PayrollSetsTableProps) {
  if (payrollSets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payroll sets found</h3>
          <p className="text-sm">Get started by creating your first payroll set above.</p>
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
              Set Name
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Pay Frequency
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Last Run Date
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Status
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Created Date
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrollSets.map((payrollSet) => (
            <PayrollSetRow 
              key={payrollSet.payroll_set_id} 
              payrollSet={payrollSet} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}