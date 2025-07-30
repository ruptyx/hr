// /app/hr/admin/departments/page.tsx

import { DepartmentsClientPage } from "./_components/departments-client-page";
import { getDepartments } from "./data";

export default async function ManageDepartmentsPage() {
  const departments = await getDepartments();
  return (
    <div className="p-4 md:p-8 bg-white text-black">
      <DepartmentsClientPage departments={departments} />
    </div>
  );
}
