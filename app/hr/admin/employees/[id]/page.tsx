// /app/hr/admin/employees/[id]/page.tsx
import { getEmployeeById, getPotentialManagers, getSalaryComponentTypes, getEmployeeCompensation } from '../../employees/data';
import { EditEmployeeForm } from './_components/edit-employee-form';
import { notFound } from 'next/navigation';

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }

  // Fetch all data in parallel for better performance
  const [employee, managers, salaryComponentTypes, compensation] = await Promise.all([
    getEmployeeById(id),
    getPotentialManagers(id),
    getSalaryComponentTypes(),
    getEmployeeCompensation(id)
  ]);

  if (!employee) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Employee</h1>
          <p className="text-neutral-500">
            Update personal and employment details for {employee.name_english}.
          </p>
        </div>
        <EditEmployeeForm 
          employee={employee} 
          managers={managers}
          salaryComponentTypes={salaryComponentTypes}
          compensation={compensation}
        />
      </div>
    </div>
  );
}
