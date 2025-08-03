// /app/hr/admin/payroll-sets/page.tsx

import { BackButton } from "@/components/shared/back-button";
import { getPayrollSets } from "./data";
import { PayrollSetsClientPage } from "@/app/hr/admin/payroll-sets/_components/payroll-set-client";

export default async function ManagePayrollSetsPage() {
  const payrollSets = await getPayrollSets();
  
  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <BackButton />
      </div>
      <PayrollSetsClientPage payrollSets={payrollSets} />
    </div>
  );
}