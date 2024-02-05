import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useMemo, useState } from "react";
import { addDays, differenceInHours, format } from "date-fns";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { DateRange } from "react-day-picker";
import { UTCDate } from "@date-fns/utc";

import { cn, formatAsUSD } from "@/utils/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TimePicker from "./time-picker";
import { start } from "repl";
import { ConfirmBid } from "./ConfirmBid";
import { Tables } from "@/lib/types/database.types";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TimeOption = {
  value: string;
  label: string;
};

type Props = {
  user: Tables<"users"> | null;
  pullUserOrders: () => Promise<void>;
};

const gpuHourMarketRate = 2.85;

function parseDateAsUTC(date: Date) {
  const dateString = format(date, "yyyy-MM-dd");
  return new Date(dateString + "T00:00:00.000Z");
}

export default function ProcurementForm({ user, pullUserOrders }: Props) {
  const [gpuCount, setGpuCount] = useState(30);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), 10),
    to: addDays(new Date(), 15),
  });
  const [startTime, setStartTime] = useState<TimeOption | null>(null);
  const [endTime, setEndTime] = useState<TimeOption | null>(null);
  const [bidRate, setBidRate] = useState(gpuHourMarketRate);
  const startDateTimeUTC = useMemo(() => {
    if (date?.from && startTime) {
      const newStartDate = parseDateAsUTC(date.from);
      newStartDate.setUTCHours(Number(startTime.value), 0, 0, 0);
      return newStartDate;
    }
  }, [date?.from, startTime]);

  const endDateTimeUTC = useMemo(() => {
    if (!endTime) {
      return;
    }
    if (date?.to) {
      const newEndDate = parseDateAsUTC(date.to);
      newEndDate.setUTCHours(Number(endTime.value), 0, 0, 0);
      return newEndDate;
    } else if (date?.from) {
      const newEndDate = parseDateAsUTC(date.from);
      newEndDate.setUTCHours(Number(endTime.value), 0, 0, 0);
      return newEndDate;
    }
  }, [date?.to, date?.from, endTime]);

  const hoursCount = useMemo(() => {
    if (startDateTimeUTC && endDateTimeUTC) {
      return differenceInHours(endDateTimeUTC, startDateTimeUTC);
    }
    return 0;
  }, [startDateTimeUTC, endDateTimeUTC]);

  const bidTotalPrice = useMemo(() => {
    return Math.ceil(bidRate * hoursCount * gpuCount * 100) / 100;
  }, [bidRate, hoursCount, gpuCount]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-evenly pt-2 md:pt-4">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Label htmlFor="when">On which date(s) do you need GPUs?</Label>
            <div className={cn("grid gap-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {date?.from ? (
            <div className="space-y-2">
              <Label htmlFor="gpus">
                What time should your reservation start?
              </Label>
              <div className="flex items-center">
                <p className="mr-2 text-sm">
                  {format(date.from, "LLL dd, y")} at
                </p>
                <TimePicker
                  selectedTime={startTime}
                  setSelectedTime={setStartTime}
                />
              </div>
            </div>
          ) : null}{" "}
          {date?.from ? (
            <div className="space-y-2">
              <Label htmlFor="gpus">
                What time should your reservation end?
              </Label>
              <div className="flex items-center">
                <p className="mr-2 text-sm">
                  {format(date.to || date.from, "LLL dd, y")} at
                </p>
                <TimePicker
                  selectedTime={endTime}
                  setSelectedTime={setEndTime}
                />
              </div>
            </div>
          ) : null}
          <p className="text-lg text-center">
            <span className="font-semibold">{hoursCount}</span> hour
            {hoursCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="hidden md:flex">
          <Separator orientation="vertical" />
        </div>

        <Separator className="my-8 flex md:hidden" />

        <div className="flex flex-col gap-6 justify-between">
          <div className="space-y-2">
            <Label htmlFor="gpus">How many GPUs do you need per hour?</Label>
            <Slider
              onValueChange={(val) => setGpuCount(val[0])}
              defaultValue={[gpuCount]}
              max={100}
              step={1}
            />
          </div>
          <p className="text-lg text-center">
            <span className="font-semibold">{gpuCount}</span> GPU
            {gpuCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col gap-6">
        {/* <div className="flex flex-row overflow-auto">
          {Array.from({ length: hoursCount }, (_, index) => (
            <div key={index} className="flex flex-col">
              {Array.from({ length: gpuCount }, (_, index) => (
                <span
                  className="w-2 h-2 border-[1px] m-[1px] border-neutral-500"
                  key={index}
                ></span>
              ))}
            </div>
          ))}
        </div> */}
        <div className="flex items-center justify-center">
          <div>
            {" "}
            You're bidding for{" "}
            <span className="font-bold">
              {(hoursCount * gpuCount).toLocaleString()}
            </span>{" "}
            total GPU-hours
            <div className="flex items-center">
              {" "}
              at
              <Input
                className="w-24 mx-2"
                step="0.01"
                type="number"
                value={bidRate}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value.includes(".") && value.split(".")[1].length > 2) {
                    return;
                  }
                  setBidRate(Number(value));
                }}
              />{" "}
              USD per GPU-hour{" "}
            </div>
          </div>
        </div>
        {bidTotalPrice > 0 ? (
          <p className="flex items-center justify-center">
            Total:
            <span className="font-semibold ml-1">
              {formatAsUSD(bidTotalPrice)}
            </span>{" "}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="rounded-full" variant="ghost" size="icon">
                  <Info className=" h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                {" "}
                {(hoursCount * gpuCount).toLocaleString()} *{" "}
                {formatAsUSD(bidRate)} ={" "}
                <span className="font-semibold">
                  {formatAsUSD(bidTotalPrice)}
                </span>{" "}
              </PopoverContent>
            </Popover>
          </p>
        ) : null}
        <div className="flex justify-center">
          <ConfirmBid
            hoursCount={hoursCount}
            gpuCount={gpuCount}
            startDateTimeUTC={startDateTimeUTC}
            endDateTimeUTC={endDateTimeUTC}
            user={user}
            bidTotalPrice={bidTotalPrice}
            pricePerGPU={bidRate}
            pullUserOrders={pullUserOrders}
          />
        </div>
      </div>
    </>
  );
}
