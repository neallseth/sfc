import { NextRequest } from "next/server";
import { z } from "zod";

const bid = z.object({
  user_id: z.coerce.number(),
  bid_start_time: z.string().datetime(),
  bid_end_time: z.string().datetime(),
  gpus_per_hour: z.coerce.number(),
  price_per_gpu_hour: z.coerce.number(),
});

export async function POST(request: NextRequest) {
  const res = bid.parse(await request.json());

  return Response.json({ res });
}
