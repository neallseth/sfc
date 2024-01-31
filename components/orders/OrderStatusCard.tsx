import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import { Tables } from "@/lib/types/database.types";

type Props = {
  countsByTime: {
    date: string;
    times: {
      time: string;
      count: number;
    }[];
  }[];
  order: Tables<"bids">;
};

export default function OrderStatusCard({ countsByTime, order }: Props) {
  return (
    <div className="flex flex-col">
      {countsByTime
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .map((bidResult) => {
          return (
            <div key={bidResult.date}>
              <span className="text-xs font-semibold">
                {format(new UTCDate(bidResult.date), "MMM d, yyyy")}
              </span>
              <div>
                {bidResult.times.map((hour) => {
                  return (
                    <span className="text-xs" key={hour.time}>
                      {hour.time} UTC: {hour.count}/{order.gpus_per_hour}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
