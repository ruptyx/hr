// /app/hr/admin/salary-components/page.tsx

import { BackButton } from "@/components/shared/back-button";
import { getSalaryComponents } from "./data";
import { SalaryComponentsClientPage } from "@/app/hr/admin/salary-components/_components/components-client-page";

export default async function ManageSalaryComponentsPage() {
  const salaryComponents = await getSalaryComponents();
  
  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <BackButton />
      </div>
      <SalaryComponentsClientPage salaryComponents={salaryComponents} />
    </div>
  );
}