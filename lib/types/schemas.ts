import { z } from "zod";

export const capacitySchema = z.array(
  z.object({ date: z.string(), capacity: z.number() })
);

export type CapacityType = z.infer<typeof capacitySchema>;
