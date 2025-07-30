// /app/hr/employees/page.tsx
import { getEmployees } from './data';
import { EmployeesClientPage } from './_components/employees-client-page';

export default async function EmployeesPage() {
  // Fetch all employees on the server initially.
  const employees = await getEmployees();

  return (
    <div className="p-4 md:p-8">
      {/* Pass the full list to the client component which will handle filtering */}
      <EmployeesClientPage employees={employees} />
    </div>
  );
}
