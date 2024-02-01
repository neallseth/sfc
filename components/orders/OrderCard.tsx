import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tables } from "@/lib/types/database.types";
import {
  CircleDashed,
  Badge,
  Ban,
  MoreHorizontal,
  FilePenLine,
  PencilRuler,
  ArrowBigRight,
  MoveRight,
  ChevronsUpDown,
} from "lucide-react";
import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { formatAsUSD } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import OrderStatusCard from "@/components/orders/OrderStatusCard";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Props = {
  type: "bid" | "reservation";
  order: Tables<"bids">;
  pullUserOrders: () => Promise<void>;
  refreshTime: number | null;
};
export default function OrderCard({
  type,
  order,
  pullUserOrders,
  refreshTime,
}: Props) {
  const [bidResults, setBidResults] = useState<Array<
    Tables<"reserved_gpu_hours">
  > | null>(null);

  const countsByTime = useMemo(() => {
    const groupedByDateAndTime: { [date: string]: { [time: string]: number } } =
      {};

    bidResults?.forEach((res) => {
      const dateTime = new Date(res.hour_start_time);
      const date = dateTime.toISOString().split("T")[0]; // This is already in UTC
      const time = dateTime.toISOString().split("T")[1].substring(0, 5); // This is also in UTC

      if (!groupedByDateAndTime[date]) {
        groupedByDateAndTime[date] = {};
      }
      if (!groupedByDateAndTime[date][time]) {
        groupedByDateAndTime[date][time] = 0;
      }
      groupedByDateAndTime[date][time]++;
    });

    const counts = Object.entries(groupedByDateAndTime).map(([date, times]) => {
      const timesArray = Object.entries(times).map(([time, count]) => ({
        time,
        count,
      }));
      return { date, times: timesArray };
    });
    console.log(counts);
    return counts;
  }, [bidResults]);

  useEffect(() => {
    pullBidResults();
    console.log("pulling bid results");
  }, [refreshTime]);

  async function pullBidResults() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reserved_gpu_hours")
      .select()
      .eq("bid_id", order.id);
    if (error) {
      console.error(error);
    } else {
      setBidResults(data);
      console.log(data);
    }
  }

  async function handleOrderCancel(orderID: string) {
    async function deleteAndRefresh() {
      const supabase = createClient();
      const { error } = await supabase.from("bids").delete().eq("id", orderID);
      if (error) {
        throw error;
      }
      await pullUserOrders();
    }
    toast.promise(deleteAndRefresh(), {
      loading: "Cancelling bid...",
      success: () => {
        return `Cancelled bid for ${order.total_gpu_hours} GPU-hours`;
      },
      error: "Failed to cancel bid",
    });
  }

  if (type === "bid") {
    return (
      <Alert>
        {/* <CircleDashed color="#F1C40F" className="h-4 w-4" /> */}
        <Badge color="grey" className="h-4 w-4" />
        <AlertTitle className="pr-4">
          Bid: {formatAsUSD(order.total_bid_price)} for{" "}
          {order.total_gpu_hours.toLocaleString()} GPU-hours
        </AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p className="text-xs">
            {order.gpus_per_hour} GPUs for {order.total_hours} hours @ $
            {order.price_per_gpu_hour}/GPU/hour
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs">
                {format(new UTCDate(order.bid_start_time), "MMMM d, yyyy")}
              </p>
              <p className="text-xs">
                {format(new UTCDate(order.bid_start_time), "HH:mm") + " UTC"}
              </p>
            </div>
            <MoveRight className="h-4 w-4" />
            <div>
              <p className="text-xs">
                {format(new UTCDate(order.bid_end_time), "MMMM d, yyyy")}
              </p>
              <p className="text-xs">
                {format(new UTCDate(order.bid_end_time), "HH:mm") + " UTC"}
              </p>
            </div>
          </div>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex border-dotted mt-2"
              >
                <span className=" grow">Order status</span>
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <OrderStatusCard countsByTime={countsByTime} order={order} />
            </CollapsibleContent>
          </Collapsible>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="absolute top-0 right-0 rounded-full"
                variant="ghost"
                size="icon"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <PencilRuler className="mr-2 h-4 w-4" />
                <span>Modify Bid</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOrderCancel(order.id)}>
                <Ban className="mr-2 h-4 w-4" />
                <span>Cancel Bid</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDescription>
      </Alert>
    );
  }
}
