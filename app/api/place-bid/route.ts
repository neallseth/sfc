import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const bid = z.object({
  user_id: z.coerce.number(),
  bid_start_time: z.string().datetime(),
  bid_end_time: z.string().datetime(),
  gpus_per_hour: z.coerce.number(),
  price_per_gpu_hour: z.coerce.number().multipleOf(0.01),
});

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  try {
    const {
      user_id,
      bid_start_time,
      bid_end_time,
      gpus_per_hour,
      price_per_gpu_hour,
    } = bid.parse(await request.json());
    const supabase = createClient(cookieStore);

    console.log({
      user_id,
      bid_start_time,
      bid_end_time,
      gpus_per_hour,
      price_per_gpu_hour,
    });

    const { error } = await supabase.from("bids").insert({
      user_id,
      bid_start_time,
      bid_end_time,
      gpus_per_hour,
      price_per_gpu_hour,
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
