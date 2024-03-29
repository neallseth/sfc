import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import { Tables } from "@/lib/types/database.types";
import { BadgeCheck, BadgeAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-4">
      {countsByTime
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .map((bidResult) => {
          return (
            <div key={bidResult.date} className="flex flex-col items-center">
              <div>
                <span className="text-xs font-semibold">
                  {format(new UTCDate(bidResult.date), "MMM d, yyyy")}
                </span>
                <div className="flex flex-col gap-2">
                  {bidResult.times
                    .sort((a, b) => (a.time > b.time ? 1 : -1))
                    .map((hour) => {
                      return (
                        <div key={hour.time} className="flex">
                          <span className="text-xs">
                            {" "}
                            {hour.time} UTC: {hour.count}/{order.gpus_per_hour}{" "}
                          </span>
                          {hour.count === order.gpus_per_hour ? (
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger>
                                  <BadgeCheck
                                    color="green"
                                    className="ml-2 h-4 w-4"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Full amount received</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger>
                                  <BadgeAlert
                                    color="#F1C40F"
                                    className="ml-2 h-4 w-4"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Partial amount received</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}{" "}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
