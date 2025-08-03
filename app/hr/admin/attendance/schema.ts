// /app/hr/admin/attendance/schema.ts
import { z } from "zod";

// This schema validates the data AFTER it has been parsed from the Excel file.
export const attendanceRowSchema = z.object({
  "Employee ID": z.number().int().positive({ error: "Employee ID must be a positive number." }),
  "First Name": z.string().min(1, { error: "First Name is required." }),
  Department: z.string().min(1, { error: "Department is required." }),
  Date: z.date({ 
    error: (issue) => 
      issue.input === undefined 
        ? "Date is required and must be a valid date." 
        : "Date must be a valid date."
  }),
  Weekday: z.string().min(1, { error: "Weekday is required." }),
  // Punch times can be numbers (Excel time format) or strings (HH:MM)
  "First Punch": z.union([z.number(), z.string()]), 
  "Last Punch": z.union([z.number(), z.string()]),
});

// This defines the type for our state and props, based on the schema.
export type ParsedAttendanceRecord = z.infer<typeof attendanceRowSchema>;
