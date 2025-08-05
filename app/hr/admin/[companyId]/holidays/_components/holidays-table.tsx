import { Holiday } from '../data'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { HolidayRow } from './holiday-row'

interface HolidaysTableProps {
  holidays: Holiday[]
}

export function HolidaysTable({ holidays }: HolidaysTableProps) {
  if (holidays.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No holidays found</h3>
          <p className="text-sm">Get started by adding your first holiday above.</p>
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
              Holiday Name
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Date
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Day of Week
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Created Date
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Last Modified
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holidays.map((holiday) => (
            <HolidayRow 
              key={holiday.holiday_id} 
              holiday={holiday} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}