import { BackButton } from "@/components/shared/back-button";
import { AttendanceClientPage } from "./_components/attendance-client-page";
import { getAttendanceRecords } from "./data";

export default async function ImportAttendancePage() {
  // Fetch previously saved attendance records from the database on the server.
  const previousAttendances = await getAttendanceRecords();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <BackButton />
      </div>
      {/* Pass the fetched records to the client component to be displayed initially. */}
      <AttendanceClientPage previousAttendances={previousAttendances} />
    </div>
  );
}