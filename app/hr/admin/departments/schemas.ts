// /app/hr/admin/departments/schemas.ts

import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Department name is required." })
    .min(3, { message: "Department name must be at least 3 characters." })
    .max(255, { message: "Department name must not exceed 255 characters." }),
  parent_department_id: z
    .string()
    .optional()
    .transform(val => {
      if (!val || val === "" || val === "none") return null;
      return val;
    })
    .refine(val => {
      if (val === null) return true;
      // Check if it's a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(val);
    }, { message: "Invalid parent department ID." }),
});

export const deleteDepartmentSchema = z.object({
  id: z.string().uuid({ message: "Invalid department ID." }),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;
export type DeleteDepartmentData = z.infer<typeof deleteDepartmentSchema>;