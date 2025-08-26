import { Holiday } from '../data'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { HolidayActions } from './holiday-actions'

interface HolidayRowProps {
  holiday: Holiday
}

export function HolidayRow({ holiday }: HolidayRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCreatedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDayOfWeek = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long'
    })
  }

  const isUpcoming = (dateString: string) => {
    const holidayDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return holidayDate >= today
  }

  const isPast = (dateString: string) => {
    const holidayDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return holidayDate < today
  }

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium text-gray-900">
        <div className="flex items-center gap-2">
          {holiday.holiday_name}
          {isUpcoming(holiday.holiday_date) && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              Upcoming
            </Badge>
          )}
          {isPast(holiday.holiday_date) && (
            <Badge variant="secondary" className="bg-gray-50 text-gray-500 border-gray-200">
              Past
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-gray-900 font-medium">
        {formatDate(holiday.holiday_date)}
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {getDayOfWeek(holiday.holiday_date)}
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {formatCreatedDate(holiday.created_date)}
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {holiday.modified_date 
          ? formatCreatedDate(holiday.modified_date)
          : '—'
        }
      </TableCell>
      <TableCell>
        <HolidayActions holiday={holiday} />
      </TableCell>
    </TableRow>
  )
}