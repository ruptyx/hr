// /app/hr/admin/employees/new/page.tsx

import { AddEmployeeForm } from "./_components/add-employee-form";

// In a real app, this would fetch from your database
const getFormData = async () => {
  const departments = [
    { department_id: 1, department_name: "Technology" },
    { department_id: 2, department_name: "Human Resources" },
    { department_id: 3, department_name: "Product" },
    { department_id: 4, department_name: "Sales" },
    { department_id: 5, department_name: "Finance" },
  ];

  const positions = [
    { position_id: 101, title: "Junior Software Engineer", department_id: 1 },
    { position_id: 102, title: "Lead Software Engineer", department_id: 1 },
    { position_id: 201, title: "HR Generalist", department_id: 2 },
    { position_id: 301, title: "Senior Product Manager", department_id: 3 },
    { position_id: 401, title: "Sales Director", department_id: 4 },
    { position_id: 501, title: "Senior Accountant", department_id: 5 },
  ];

  return { departments, positions };
};

export default async function AddNewEmployeePage() {
  const { departments, positions } = await getFormData();

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-white text-black">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Add New Employee</h1>
        <p className="text-neutral-500">
          Follow the steps to onboard a new member to the team.
        </p>
      </header>

      <main className="mx-auto w-full max-w-4xl">
        <AddEmployeeForm departments={departments} positions={positions} />
      </main>
    </div>
  );
}