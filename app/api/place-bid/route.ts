import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const bid = z.object({
  user_id: z.coerce.number(),
  bid_start_time: z.string().datetime(),
  bid_end_time: z.string().datetime(),
  total_hours: z.coerce.number(),
  gpus_per_hour: z.coerce.number(),
  total_gpu_hours: z.coerce.number(),
  price_per_gpu_hour: z.coerce.number().multipleOf(0.01),
  total_bid_price: z.coerce.number().multipleOf(0.01),
});

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  try {
    const {
      user_id,
      bid_start_time,
      bid_end_time,
      total_hours,
      gpus_per_hour,
      total_gpu_hours,
      price_per_gpu_hour,
      total_bid_price,
    } = bid.parse(await request.json());
    const supabase = createClient(cookieStore);

    const { error } = await supabase.from("bids").insert({
      user_id,
      bid_start_time,
      bid_end_time,
      total_hours,
      gpus_per_hour,
      total_gpu_hours,
      price_per_gpu_hour,
      total_bid_price,
    });
    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response("Success", {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ err }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
