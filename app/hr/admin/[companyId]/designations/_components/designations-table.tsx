import { Designation } from '../data'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DesignationRow } from './designations-row'

interface DesignationsTableProps {
  designations: Designation[]
}

export function DesignationsTable({ designations }: DesignationsTableProps) {
  if (designations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No designations found</h3>
          <p className="text-sm">Get started by adding your first designation above.</p>
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
              Designation Title
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
          {designations.map((designation) => (
            <DesignationRow 
              key={designation.designation_id} 
              designation={designation} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}