// /app/hr/admin/salary-components/page.tsx

import { SalaryComponentsClientPage } from "./_components/components-client-page";
import { getSalaryComponentTypes } from "./data";

export default async function ManageSalaryComponentsPage() {
  const salaryComponents = await getSalaryComponentTypes();

  return (
    <div className="p-4 md:p-8 bg-white text-black">
      <SalaryComponentsClientPage salaryComponents={salaryComponents} />
    </div>
  );
}
