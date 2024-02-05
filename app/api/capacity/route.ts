import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { UTCDate } from "@date-fns/utc";
import { addDays, format } from "date-fns";

import { CapacityType } from "@/lib/types/schemas";
const reservationSchema = z.record(z.number());
const STARTING_CAPACITY = 2400;

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  try {
    const supabase = createClient(cookieStore);
    let { data: rawReservations, error: capacityError } = await supabase.rpc(
      "capacity_day"
    );

    if (capacityError) {
      console.error(capacityError);
      return new Response(JSON.stringify({ capacityError }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    const reservations = rawReservations
      ? reservationSchema.parse(rawReservations)
      : {};

    const today = new UTCDate();

    const data: CapacityType = [];
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dateKey = format(date, "yyyy-MM-dd");
      const capacity = STARTING_CAPACITY - (reservations[dateKey] || 0);
      const dateCapacity = { date: format(date, "MMM d"), capacity };
      data.push(dateCapacity);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
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
