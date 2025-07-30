// /app/hr/employees/_components/employees-list.tsx
import type { Employee } from '../data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import Link from 'next/link';

// This is now a simple presentational component.
export function EmployeesList({ employees }: { employees: Employee[] }) {
  return (
    <div className="border rounded-lg mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile Number</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee.party_id}>
                <TableCell className="font-medium">{employee.name_english}</TableCell>
                <TableCell>{employee.email || 'N/A'}</TableCell>
                <TableCell>{employee.mobile_number}</TableCell>
                <TableCell>{employee.manager_name || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" className="h-8 w-8 p-0">
                    {/* Corrected the link to point to the /hr/admin/employees/[id] route */}
                    <Link href={`/hr/admin/employees/${employee.party_id}`}>
                      <span className="sr-only">Edit Employee</span>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No employees found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
