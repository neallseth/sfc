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
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TimePicker from "./time-picker";
import { start } from "repl";

type timeOption = {
  value: string;
  label: string;
};

export default function ProcurementForm() {
  const [gpuCount, setGpuCount] = useState(30);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), 10),
    to: addDays(new Date(), 15),
  });
  const [startTime, setStartTime] = useState<timeOption | null>(null);
  const [endTime, setEndTime] = useState<timeOption | null>(null);
  const startDateTimeUTC = useMemo(() => {
    if (date?.from && startTime) {
      const newStartDate = new Date(date.from);
      newStartDate.setUTCHours(Number(startTime.value), 0, 0, 0);
      return newStartDate;
    }
  }, [date?.from, startTime]);

  const endDateTimeUTC = useMemo(() => {
    if (!endTime) {
      return;
    }
    if (date?.to) {
      const newEndDate = new Date(date.to);
      newEndDate.setUTCHours(Number(endTime.value), 0, 0, 0);
      return newEndDate;
    } else if (date?.from) {
      const newEndDate = new Date(date.from);
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

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <Label htmlFor="when">On what date(s) do you need GPUs?</Label>
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
          <div className="space-y-1">
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
            {startDateTimeUTC ? (
              <p className="text-xs italic">
                {format(startDateTimeUTC, "LLL dd, yyyy, h:mm aaaa O")}
              </p>
            ) : null}
          </div>
        ) : null}{" "}
        {date?.from ? (
          <div className="space-y-1">
            <Label htmlFor="gpus">What time should your reservation end?</Label>
            <div className="flex items-center">
              <p className="mr-2 text-sm">
                {format(date.to || date.from, "LLL dd, y")} at
              </p>
              <TimePicker selectedTime={endTime} setSelectedTime={setEndTime} />
            </div>
          </div>
        ) : null}
      </div>
      <p className="text-lg text-center py-4">
        <span className="font-semibold">{hoursCount}</span> hour
        {hoursCount === 1 ? "" : "s"}
      </p>
      <div className="space-y-1">
        <Label htmlFor="gpus">How many GPUs do you need per hour?</Label>
        <Slider
          onValueChange={(val) => setGpuCount(val[0])}
          defaultValue={[gpuCount]}
          max={100}
          step={1}
        />
      </div>
      <p className="text-lg text-center py-4">
        <span className="font-semibold">{gpuCount}</span> GPU
        {gpuCount === 1 ? "" : "s"}
      </p>
      {Array.from({ length: hoursCount }, (_, index) => (
        <div className="flex flex-row">
          {Array.from({ length: gpuCount }, (_, index) => (
            <span
              className="flex flex-col m-0 w-2 h-2 border-2 border-rose-500"
              key={index}
            ></span>
          ))}
        </div>
      ))}
    </>
  );
}
