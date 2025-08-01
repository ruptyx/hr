// /app/hr/admin/employees/new/page.tsx

import { BackButton } from "@/components/shared/back-button";
import { AddEmployeeForm } from "./_components/add-employee-form";
// Import all necessary data fetching functions
import { getDepartmentsForForm, getPositionTypesForForm, getEmployeesForManagerDropdown } from "./data";

export default async function AddNewEmployeePage() {
  // Fetch all form data in parallel
  const [departments, positionTypes, managers] = await Promise.all([
    getDepartmentsForForm(),
    getPositionTypesForForm(),
    getEmployeesForManagerDropdown(),
  ]);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="mb-4">
        <BackButton />
      </div>
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Add New Employee</h1>
        <p className="text-neutral-500">
          Follow the steps to onboard a new member to the team.
        </p>
      </header>

      <main className="mx-auto w-full max-w-4xl">
        <AddEmployeeForm 
            departments={departments} 
            positionTypes={positionTypes}
            managers={managers}
        />
      </main>
    </div>
  );
}
