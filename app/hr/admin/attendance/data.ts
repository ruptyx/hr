// /app/hr/admin/attendance/data.ts
"use server";

import { ParsedAttendanceRecord } from "./schema";
import { createClient } from "@/utils/supabase/server";

export async function getAttendanceRecords(): Promise<ParsedAttendanceRecord[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('attendance_record')
        .select(`
            employee_party_id,
            attendance_date,
            check_in_time,
            check_out_time
        `)
        .order('attendance_date', { ascending: false })
        .limit(200);

    if (error) {
        console.error("Error fetching attendance records:", error);
        return [];
    }
    
    // Transform the raw database data into the 'ParsedAttendanceRecord' format
    const transformedData = data.map((record: any) => {
        const attendanceDate = new Date(record.attendance_date + 'T00:00:00');
        const checkInTime = record.check_in_time ? new Date(record.check_in_time) : null;
        const checkOutTime = record.check_out_time ? new Date(record.check_out_time) : null;

        return {
            "Employee ID": record.employee_party_id,
            "First Name": "N/A", // Not available from attendance table
            Department: "N/A", // Not available from attendance table
            "Date": attendanceDate,
            "Weekday": attendanceDate.toLocaleDateString('en-US', { weekday: 'long' }),
            "First Punch": checkInTime ? checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '-',
            "Last Punch": checkOutTime ? checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '-',
        };
    });

    return transformedData as ParsedAttendanceRecord[];
}