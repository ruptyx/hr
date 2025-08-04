// /app/hr/admin/leave-types/page.tsx

import { BackButton } from "@/components/shared/back-button";
import { LeaveTypesClientPage } from "./_components/leave-types-client-page";
import { getLeaveTypes, getSalaryComponents } from "./data";

export default async function ManageLeaveTypesPage() {
  const [leaveTypes, salaryComponents] = await Promise.all([
    getLeaveTypes(),
    getSalaryComponents()
  ]);
  
  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <BackButton />
      </div>
      <LeaveTypesClientPage 
        leaveTypes={leaveTypes} 
        salaryComponents={salaryComponents}
      />
    </div>
  );
}