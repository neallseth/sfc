"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clock } from "lucide-react";

type timeOption = {
  value: string;
  label: string;
};

const timeOptions: timeOption[] = [
  { value: "0", label: "00:00 UTC" },
  { value: "1", label: "01:00 UTC" },
  { value: "2", label: "02:00 UTC" },
  { value: "3", label: "03:00 UTC" },
  { value: "4", label: "04:00 UTC" },
  { value: "5", label: "05:00 UTC" },
  { value: "6", label: "06:00 UTC" },
  { value: "7", label: "07:00 UTC" },
  { value: "8", label: "08:00 UTC" },
  { value: "9", label: "09:00 UTC" },
  { value: "10", label: "10:00 UTC" },
  { value: "11", label: "11:00 UTC" },
  { value: "12", label: "12:00 UTC" },
  { value: "13", label: "13:00 UTC" },
  { value: "14", label: "14:00 UTC" },
  { value: "15", label: "15:00 UTC" },
  { value: "16", label: "16:00 UTC" },
  { value: "17", label: "17:00 UTC" },
  { value: "18", label: "18:00 UTC" },
  { value: "19", label: "19:00 UTC" },
  { value: "20", label: "20:00 UTC" },
  { value: "21", label: "21:00 UTC" },
  { value: "22", label: "22:00 UTC" },
  { value: "23", label: "23:00 UTC" },
];

type TimePickerProps = {
  selectedTime: timeOption | null;
  setSelectedTime: (newTime: timeOption | null) => void;
};

export default function TimePicker({
  selectedTime,
  setSelectedTime,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="font-normal">
            {selectedTime ? (
              <>{selectedTime.label}</>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Set time
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <TimeList setOpen={setOpen} setSelectedTime={setSelectedTime} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="font-normal">
          {selectedTime ? (
            <>{selectedTime.label}</>
          ) : (
            <>
              <Clock className="mr-2 h-4 w-4" />
              Set time
            </>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <TimeList setOpen={setOpen} setSelectedTime={setSelectedTime} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function TimeList({
  setOpen,
  setSelectedTime,
}: {
  setOpen: (open: boolean) => void;
  setSelectedTime: (newTime: timeOption | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter times" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {timeOptions.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={(value) => {
                setSelectedTime(
                  timeOptions.find((el) => el.value === value) || null
                );
                setOpen(false);
              }}
            >
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
