import { Department } from '../data'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DepartmentActions } from './department-actions'

interface DepartmentRowProps {
  department: Department
  allDepartments: Department[]
}

export function DepartmentRow({ department, allDepartments }: DepartmentRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getChildrenCount = (departmentId: number) => {
    return allDepartments.filter(dept => dept.parent_id === departmentId).length
  }

  const childrenCount = getChildrenCount(department.department_id)

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium text-gray-900">
        <div className="flex items-center gap-2">
          {department.department_name}
          {childrenCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {childrenCount} sub-dept{childrenCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {department.parent_name || (
          <span className="italic text-gray-400">Top Level</span>
        )}
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {formatDate(department.created_date)}
      </TableCell>
      <TableCell className="text-gray-500 text-sm">
        {department.modified_date 
          ? formatDate(department.modified_date)
          : '—'
        }
      </TableCell>
      <TableCell>
        <DepartmentActions 
          department={department} 
          allDepartments={allDepartments.filter(d => d.department_id !== department.department_id)}
        />
      </TableCell>
    </TableRow>
  )
}