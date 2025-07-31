
import { z } from "zod";

export const positionSchema = z.object({
  title: z.string().min(3, { message: "Position title must be at least 3 characters." }),
  description: z.string().optional(),
});
