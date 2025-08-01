// /app/hr/admin/salary-components/page.tsx

import { BackButton } from "@/components/shared/back-button";
import { SalaryComponentsClientPage } from "./_components/components-client-page";
import { getSalaryComponentTypes } from "./data";

export default async function ManageSalaryComponentsPage() {
  const salaryComponents = await getSalaryComponentTypes();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <BackButton />
      </div>
      <SalaryComponentsClientPage salaryComponents={salaryComponents} />
    </div>
  );
}
