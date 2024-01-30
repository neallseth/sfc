import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const bid = z.object({
  hour_start_time: z.string().datetime(),
});

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  try {
    const { hour_start_time } = bid.parse(await request.json());
    const supabase = createClient(cookieStore);

    const { data: startingGPUs, error: gpuCountError } = await supabase
      .from("gpus")
      .select();

    const { data: reservations, error: reservationRetrievalError } =
      await supabase
        .from("reserved_gpu_hours")
        .select()
        .eq("hour_start_time", hour_start_time);

    const reservedGPUIDs = new Set(reservations?.map((gpu) => gpu.gpu_id));

    const availableGPUIDs = new Set(
      startingGPUs
        ?.filter((gpu) => !reservedGPUIDs.has(gpu.id))
        .map((gpu) => gpu.id)
    );

    if (startingGPUs === null || reservations === null) {
      return new Response(
        JSON.stringify({ gpuCountError, reservationRetrievalError }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: bids, error: retrieveBidsError } = await supabase
      .from("bids")
      .select()
      .lte("bid_start_time", hour_start_time)
      .gt("bid_end_time", hour_start_time)
      .order("price_per_gpu_hour", { ascending: false })
      .limit(availableGPUIDs.size);

    if (retrieveBidsError) {
      return new Response(JSON.stringify({ retrieveBidsError }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      const newReservations = [];
      let capacityExhausted = false;
      for (const bid of bids) {
        if (capacityExhausted) {
          break;
        }
        for (let i = 0; i < bid.gpus_per_hour; i++) {
          if (!availableGPUIDs.size) {
            capacityExhausted = true;
            break;
          } else {
            const gpuID = availableGPUIDs.values().next().value;
            newReservations.push({
              hour_start_time,
              gpu_id: gpuID,
              bid_id: bid.id,
              price_per_gpu_hour: bid.price_per_gpu_hour,
            });
            availableGPUIDs.delete(gpuID);
          }
        }
      }

      const { error: reservationError } = await supabase
        .from("reserved_gpu_hours")
        .upsert(newReservations, { ignoreDuplicates: true });

      if (reservationError) {
        return new Response(JSON.stringify({ reservationError }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      return new Response(
        JSON.stringify({ insertedRows: newReservations.length }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (err) {
    return new Response(JSON.stringify({ err }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
