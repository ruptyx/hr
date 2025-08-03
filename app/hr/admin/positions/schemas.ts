// /app/hr/admin/designations/schemas.ts

import { z } from "zod";

export const designationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Designation name is required." })
    .min(2, { message: "Designation name must be at least 2 characters." })
    .max(255, { message: "Designation name must not exceed 255 characters." }),
});

export const deleteDesignationSchema = z.object({
  id: z.string().uuid({ message: "Invalid designation ID." }),
});

export type DesignationFormData = z.infer<typeof designationSchema>;
export type DeleteDesignationData = z.infer<typeof deleteDesignationSchema>;