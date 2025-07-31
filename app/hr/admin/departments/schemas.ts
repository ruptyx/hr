
import { z } from "zod";

export const departmentSchema = z.object({
  department_name: z.string().min(3, { message: "Department name must be at least 3 characters." }),
  parent_department_id: z.coerce.number().optional(),
});
