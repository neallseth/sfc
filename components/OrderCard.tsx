import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tables } from "@/lib/types/database.types";
import {
  CircleDashed,
  Ban,
  MoreHorizontal,
  FilePenLine,
  PencilRuler,
  ArrowBigRight,
  MoveRight,
} from "lucide-react";
import { format } from "date-fns";
import { UTCDateMini, UTCDate } from "@date-fns/utc";
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

type Props = {
  type: "bid" | "reservation";
  order: Tables<"bids">;
};
export default function OrderCard({ type, order }: Props) {
  if (type === "bid") {
    return (
      <Alert>
        <CircleDashed color="#F1C40F" className="h-4 w-4" />
        <AlertTitle>
          Bid for {order.total_gpu_hours.toLocaleString()} GPU-hours
        </AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p className="text-xs">
            {order.gpus_per_hour} GPUs for {order.total_hours} hours
          </p>
          {/* <Separator /> */}

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
              <DropdownMenuItem>
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
