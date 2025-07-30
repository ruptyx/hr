// /app/hr/admin/leaves/page.tsx
import { LeavesList } from './_compnents/leaves-list';
import { getLeaveRequests } from './data';

export default async function ManageLeavesPage() {
  const leaveRequests = await getLeaveRequests();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Leave Requests</h1>
        <p className="text-neutral-500">
          View all submitted leave requests from employees.
        </p>
      </div>
      <LeavesList leaveRequests={leaveRequests} />
    </div>
  );
}
