// /app/hr/admin/leave-types/page.tsx

import { getLeaveTypes } from "./data";
import { LeaveTypesClientPage } from "./_components/leave-types-client-page";

export default async function ManageLeaveTypesPage() {
  const leaveTypes = await getLeaveTypes();

  return (
    <div className="p-4 md:p-8 bg-white text-black">
      <LeaveTypesClientPage leaveTypes={leaveTypes} />
    </div>
  );
}
