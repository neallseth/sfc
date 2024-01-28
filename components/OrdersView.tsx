import OrderStatus from "@/components/OrderStatus";
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
};

const orders = true;

export default function OrdersView({ user }: Props) {
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
        {orders ? (
          <OrderStatus />
        ) : (
          <div className="flex items-center justify-center p-4">
            <CloudSun className="mr-2 h-4 w-4" />
            <p className="italic">No active orders</p>
          </div>
        )}
      </CardContent>
      {/* <CardFooter className="flex justify-between"></CardFooter> */}
    </Card>
  );
}
