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
import { useState } from "react";
import ProcurementForm from "@/components/procurement/ProcurementForm";
import { Tables } from "@/lib/types/database.types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  user: Tables<"users"> | null;
  pullUserOrders: () => Promise<void>;
};

export default function ProcurementView({ user, pullUserOrders }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center space-y-0">
        <div>
          <CardTitle>Get Compute</CardTitle>
          <CardDescription className="mt-2">
            Place a bid for the GPUs you need
          </CardDescription>
        </div>
        <Select value="ang">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select cluster" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Clusters</SelectLabel>
              <SelectItem value="ang">Angel Island</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ProcurementForm user={user} pullUserOrders={pullUserOrders} />
      </CardContent>
    </Card>
  );
}
