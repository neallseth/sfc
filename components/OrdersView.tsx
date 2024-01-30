import OrderCard from "@/components/OrderCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudSun, Server } from "lucide-react";
import { Tables } from "@/lib/types/database.types";

type Props = {
  user: Tables<"users"> | null;
  userBids: Array<Tables<"bids">> | null;
  pullUserOrders: () => Promise<void>;
};

export default function OrdersView({ user, userBids, pullUserOrders }: Props) {
  if (!user) {
    return;
  }
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center space-y-0">
        <div>
          <CardTitle>{user.name?.split(" ")[0]}'s Orders</CardTitle>
          <CardDescription>Active bids and reservations</CardDescription>
        </div>
        <Button className="m-0" variant={"outline"}>
          Order history
        </Button>
      </CardHeader>
      <CardContent>
        {userBids?.length ? (
          <div className="flex flex-col gap-6">
            {userBids.map((bid) => {
              return (
                <OrderCard
                  key={bid.id}
                  type={"bid"}
                  order={bid}
                  pullUserOrders={pullUserOrders}
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
