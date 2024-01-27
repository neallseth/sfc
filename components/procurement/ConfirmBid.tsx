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
import { useState } from "react";
import { Tables } from "@/lib/types/database.types";
import { format } from "date-fns";

type Props = {
  user: Tables<"users"> | null;
  hoursCount: number;
  gpuCount: number;
  startDateTimeUTC: Date | undefined;
  endDateTimeUTC: Date | undefined;
  bidTotalPrice: number;
};

export function ConfirmBid({
  user,
  hoursCount,
  gpuCount,
  startDateTimeUTC,
  endDateTimeUTC,
  bidTotalPrice,
}: Props) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (
    !user ||
    !hoursCount ||
    !gpuCount ||
    !startDateTimeUTC ||
    !endDateTimeUTC ||
    !bidTotalPrice
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
          <ProfileForm
            user={user}
            hoursCount={hoursCount}
            gpuCount={gpuCount}
            startDateTimeUTC={startDateTimeUTC}
            endDateTimeUTC={endDateTimeUTC}
            bidTotalPrice={bidTotalPrice}
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
        <ProfileForm
          user={user}
          hoursCount={hoursCount}
          gpuCount={gpuCount}
          startDateTimeUTC={startDateTimeUTC}
          endDateTimeUTC={endDateTimeUTC}
          bidTotalPrice={bidTotalPrice}
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

function ProfileForm({
  user,
  hoursCount,
  gpuCount,
  startDateTimeUTC,
  endDateTimeUTC,
  bidTotalPrice,
}: Props) {
  return (
    <form
      onSubmit={() => console.log("submitted")}
      className={cn("grid items-start gap-4 px-4")}
    >
      <p>
        <span className="font-bold">{gpuCount}</span> GPUs per hour, for{" "}
        <span className="font-bold">{hoursCount}</span> hours
      </p>
      {startDateTimeUTC ? (
        <div>
          <p>
            Starting at{" "}
            <span className="font-bold">
              {format(startDateTimeUTC, "LLL dd, yyyy, HH:mm 'UTC'")}
            </span>
          </p>
          <p className="text-xs italic">
            {format(startDateTimeUTC, "LLL dd, yyyy, h:mm aaaa O")}
          </p>
        </div>
      ) : null}
      {endDateTimeUTC ? (
        <div>
          <p>
            Ending at{" "}
            <span className="font-bold">
              {format(endDateTimeUTC, "LLL dd, yyyy, HH:mm 'UTC'")}
            </span>
          </p>
          <p className="text-xs italic">
            {format(endDateTimeUTC, "LLL dd, yyyy, h:mm aaaa O")}
          </p>
        </div>
      ) : null}

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
