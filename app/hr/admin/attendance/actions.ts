// /app/hr/admin/attendance/actions.ts
"use server";

import { attendanceRowSchema, ParsedAttendanceRecord } from "./schema";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Helper function to convert Excel time (fraction of a day) to HH:MM:SS string
function excelTimeToHHMMSS(excelTime: number): string {
  if (excelTime < 0 || excelTime >= 1) {
      // Handle cases where time is not a fraction, maybe it's already a string
      if (typeof excelTime === 'string') return excelTime;
      return "00:00:00";
  }
  const totalSeconds = Math.round(excelTime * 86400);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
}

export async function saveAttendanceRecords(records: ParsedAttendanceRecord[]) {
  const supabase = await createClient();

  // Validate the entire array
  const validation = z.array(attendanceRowSchema).safeParse(records);
  if (!validation.success) {
    return {
      error: "Invalid data format received. Please re-upload the file.",
    };
  }

  // Transform data for insertion
  const recordsToInsert = validation.data.map((record) => {
    const attendanceDate = new Date(record.Date);
    
    // Ensure date is in YYYY-MM-DD format for combining with time
    const dateString = attendanceDate.toISOString().split('T')[0];

    const firstPunchTime = typeof record["First Punch"] === 'number' ? excelTimeToHHMMSS(record["First Punch"]) : record["First Punch"];
    const lastPunchTime = typeof record["Last Punch"] === 'number' ? excelTimeToHHMMSS(record["Last Punch"]) : record["Last Punch"];

    const checkInTimestamp = `${dateString}T${firstPunchTime}Z`;
    const checkOutTimestamp = `${dateString}T${lastPunchTime}Z`;

    // Calculate total hours
    let totalHours = null;
    const checkInDate = new Date(checkInTimestamp);
    const checkOutDate = new Date(checkOutTimestamp);

    if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
        const diffMs = checkOutDate.getTime() - checkInDate.getTime();
        totalHours = diffMs / (1000 * 60 * 60);
    }

    console.log(records)
    return {
      employee_party_id: record["Employee ID"],
      attendance_date: dateString,
      check_in_time: checkInTimestamp,
      check_out_time: checkOutTimestamp,
      total_hours: totalHours,
    //   status: "PRESENT", // Default status
    //   location: "On-site", // Default location
    };
  });

  // Insert into the database
  const { error } = await supabase
    .from("attendance_record")
    .insert(recordsToInsert);

  if (error) {
    console.error("Error saving attendance records:", error);
    // Provide a more user-friendly error message
    if (error.code === '23503') { // foreign key violation
        console.log(error)
        return { error: `Failed to save records. An 'Employee ID' in your file does not exist in the system. Please check the data and try again.` };
    }
    return { error: `Database error: ${error.message}` };
  }

  revalidatePath("/hr/admin/attendance");
  return { success: `${records.length} records saved successfully.` };
}
