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

type Props = {
  user: Tables<"users"> | null;
  pullUserOrders: () => Promise<void>;
};

export default function ProcurementView({ user, pullUserOrders }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Compute</CardTitle>
        <CardDescription>Place a bid for the GPUs you need</CardDescription>
      </CardHeader>
      <CardContent>
        <ProcurementForm user={user} pullUserOrders={pullUserOrders} />
      </CardContent>
    </Card>
  );
}
