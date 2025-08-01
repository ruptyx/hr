// /app/hr/admin/departments/page.tsx

import { BackButton } from "@/components/shared/back-button";
import { DepartmentsClientPage } from "./_components/departments-client-page";
import { getDepartments } from "./data";

export default async function ManageDepartmentsPage() {
  const departments = await getDepartments();
  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <BackButton />
      </div>
      <DepartmentsClientPage departments={departments} />
    </div>
  );
}
