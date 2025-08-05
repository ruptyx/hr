import { Designation } from '../data'
import { TableCell, TableRow } from '@/components/ui/table'
import { DesignationActions } from './designation-actions'

interface DesignationRowProps {
  designation: Designation
}

export function DesignationRow({ designation }: DesignationRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium text-gray-900">
        {designation.designation_title}
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {formatDate(designation.created_date)}
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {designation.modified_date 
          ? formatDate(designation.modified_date)
          : '—'
        }
      </TableCell>
      <TableCell>
        <DesignationActions designation={designation} />
      </TableCell>
    </TableRow>
  )
}