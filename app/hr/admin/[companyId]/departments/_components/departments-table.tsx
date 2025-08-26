import { Department } from '../data'
import { DepartmentRow } from './department-row'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DepartmentsTableProps {
  departments: Department[]
}

export function DepartmentsTable({ departments }: DepartmentsTableProps) {
  if (departments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-sm">Get started by adding your first department above.</p>
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
              Department Name
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Parent Department
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
          {departments.map((department) => (
            <DepartmentRow 
              key={department.department_id} 
              department={department}
              allDepartments={departments}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}