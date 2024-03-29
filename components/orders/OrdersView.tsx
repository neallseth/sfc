import OrderCard from "@/components/orders/OrderCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudSun, RefreshCw } from "lucide-react";
import { Tables } from "@/lib/types/database.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  user: Tables<"users"> | null;
  userBids: Array<Tables<"bids">> | null;
  pullUserOrders: () => Promise<void>;
  bidsLoading: boolean;
  userLoading: boolean;
};

export default function OrdersView({
  user,
  userBids,
  pullUserOrders,
  bidsLoading,
  userLoading,
}: Props) {
  const [refreshTime, setRefreshTime] = useState<number | null>(null);

  if ((!user && userLoading) || bidsLoading) {
    return (
      <div className="flex flex-col gap-2 grow">
        <Skeleton className="h-64" />
      </div>
    );
  } else if (user) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row justify-between items-center space-y-0">
          <div>
            <CardTitle>{user.name?.split(" ")[0]}'s Orders</CardTitle>
            <CardDescription className="mt-2">
              Active bids and reservations
            </CardDescription>
          </div>
          <div className="flex">
            <Button disabled variant="outline">
              Order history
            </Button>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="ml-2 sm:ml-6"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      toast.promise(pullUserOrders(), {
                        loading: "Refreshing orders...",
                        success: () => {
                          setRefreshTime(Date.now());
                          return `Refreshed orders`;
                        },
                        error: "Failed to refresh orders",
                      });
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh orders</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          {userBids?.length ? (
            <div className="flex flex-col gap-6">
              {userBids
                .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
                .map((bid) => {
                  return (
                    <OrderCard
                      key={bid.id}
                      type={"bid"}
                      order={bid}
                      pullUserOrders={pullUserOrders}
                      refreshTime={refreshTime}
                    />
                  );
                })}
            </div>
          ) : (
            <div className="flex items-center justify-center p-4">
              <CloudSun className="mr-2 h-4 w-4" />
              <p className="italic">No active orders</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}
