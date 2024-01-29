import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { Tables } from "@/lib/types/database.types";
import { format, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";

// import { UTCDate } from "@date-fns/utc";

type ConfirmBidProps = {
  user: Tables<"users"> | null;
  hoursCount: number;
  gpuCount: number;
  startDateTimeUTC: Date | undefined;
  endDateTimeUTC: Date | undefined;
  bidTotalPrice: number;
  pricePerGPU: number;
  pullUserOrders: () => Promise<void>;
};

type BidFormProps = {
  user: Tables<"users">;
  hoursCount: number;
  gpuCount: number;
  startDateTimeUTC: Date;
  endDateTimeUTC: Date;
  bidTotalPrice: number;
  pricePerGPU: number;
  pullUserOrders: () => Promise<void>;
  closeModal: () => void;
};

export function ConfirmBid({
  user,
  hoursCount,
  gpuCount,
  startDateTimeUTC,
  endDateTimeUTC,
  bidTotalPrice,
  pricePerGPU,
  pullUserOrders,
}: ConfirmBidProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (
    !user ||
    !hoursCount ||
    !gpuCount ||
    !startDateTimeUTC ||
    !endDateTimeUTC ||
    !bidTotalPrice ||
    !pricePerGPU
  ) {
    return <Button disabled>Confirm bid</Button>;
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Confirm bid</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm bid</DialogTitle>
            <DialogDescription>Review and submit bid order</DialogDescription>
          </DialogHeader>
          <BidForm
            user={user}
            hoursCount={hoursCount}
            gpuCount={gpuCount}
            startDateTimeUTC={startDateTimeUTC}
            endDateTimeUTC={endDateTimeUTC}
            bidTotalPrice={bidTotalPrice}
            pricePerGPU={pricePerGPU}
            pullUserOrders={pullUserOrders}
            closeModal={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Confirm bid</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Confirm bid</DrawerTitle>
          <DrawerDescription>Review and submit bid order</DrawerDescription>
        </DrawerHeader>
        <BidForm
          user={user}
          hoursCount={hoursCount}
          gpuCount={gpuCount}
          startDateTimeUTC={startDateTimeUTC}
          endDateTimeUTC={endDateTimeUTC}
          bidTotalPrice={bidTotalPrice}
          pricePerGPU={pricePerGPU}
          pullUserOrders={pullUserOrders}
          closeModal={() => setOpen(false)}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function BidForm({
  user,
  hoursCount,
  gpuCount,
  startDateTimeUTC,
  endDateTimeUTC,
  bidTotalPrice,
  pricePerGPU,
  pullUserOrders,
  closeModal,
}: BidFormProps) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {
      user_id: user.id,
      bid_start_time: startDateTimeUTC,
      bid_end_time: endDateTimeUTC,
      total_hours: hoursCount,
      gpus_per_hour: gpuCount,
      total_gpu_hours: hoursCount * gpuCount,
      price_per_gpu_hour: pricePerGPU,
      total_bid_price: bidTotalPrice,
    };
    try {
      const response = await fetch("/api/place-bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        console.error("API error: ", err);
      } else {
        await pullUserOrders();
        closeModal();
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("grid items-start gap-4 px-4")}>
      <p>
        <span className="font-bold">{gpuCount}</span> GPUs per hour, for{" "}
        <span className="font-bold">{hoursCount}</span> hours
      </p>
      {startDateTimeUTC ? (
        <div>
          <p>
            Starting{" "}
            {/* <span className="font-bold">{formatUTCDate(startDateTimeUTC)}</span> */}
            <span className="font-bold">{startDateTimeUTC.toUTCString()}</span>
            {/* <span className="font-bold">
              {format(startDateTimeUTC, "yyyy-MM-dd'T'HH:mm:ss'Z'")}
            </span> */}
          </p>
          <p className="text-xs italic">
            {format(startDateTimeUTC, "LLL dd, yyyy, h:mm aaaa O")}
          </p>
        </div>
      ) : null}
      {endDateTimeUTC ? (
        <div>
          <p>
            Ending{" "}
            {/* <span className="font-bold">
              {format(endDateTimeUTC, "LLL dd, yyyy, HH:mm 'UTC'")}
            </span> */}
            <span className="font-bold">{endDateTimeUTC.toUTCString()}</span>
          </p>
          <p className="text-xs italic">
            {format(endDateTimeUTC, "LLL dd, yyyy, h:mm aaaa O")}
          </p>
        </div>
      ) : null}
      <Separator />
      <p className="text-lg">
        Requesting a total of{" "}
        <span className="font-bold">{hoursCount * gpuCount}</span> GPU hours for{" "}
        <span className="font-bold">${bidTotalPrice.toLocaleString()}</span>
      </p>
      <Button type="submit">
        Place bid for ${bidTotalPrice.toLocaleString()}
      </Button>
    </form>
  );
}
