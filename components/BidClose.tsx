import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import TimePicker from "@/components/procurement/time-picker";
import { UTCDate } from "@date-fns/utc";
import { toast } from "sonner";

type TimeOption = {
  value: string;
  label: string;
};

export function BidClose({ children }: { children: ReactNode }) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<TimeOption | null>(null);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleCloseAuction() {
    if (!dateTimeUTC) {
      return;
    }
    setSubmitted(true);
    try {
      const response = await fetch("/api/close-bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hour_start_time: dateTimeUTC }),
      });
      if (!response.ok) {
        console.error("Failed to close auction");
        toast.error("Failed to close auction");
      } else {
        toast.success("Auction closed", {
          description: `${format(dateTimeUTC, "MMM d, yyyy, HH:mm") + " UTC"}
            `,
        });
        const data = await response.json();
        console.log("Success:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setOpen(false);
    }
  }

  const dateTimeUTC = useMemo(() => {
    if (!date || !time) {
      return null;
    }
    const dateTime = new UTCDate(date);
    dateTime.setUTCHours(Number(time.value), 0, 0, 0);
    return dateTime;
  }, [date, time]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Close auction</DialogTitle>
          <DialogDescription>
            Distribute GPUs for a given hour based on current bids
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex justify-between gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "max-w-60 justify-start text-left font-normal grow",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Set date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <TimePicker selectedTime={time} setSelectedTime={setTime} />
          </div>
        </div>
        {dateTimeUTC ? (
          <p>
            Targeting hour starting{" "}
            <span className="font-semibold">
              {format(dateTimeUTC, "MMM d, yyyy, HH:mm") + " UTC"}
            </span>
          </p>
        ) : null}
        <DialogFooter>
          {submitted ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Closing auction...
            </Button>
          ) : (
            <Button onClick={handleCloseAuction} disabled={!dateTimeUTC}>
              Close auction
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
