import {
  AreaChart,
  BarChart,
  // Card,
  Flex,
  Subtitle,
  Switch,
  Title,
} from "@tremor/react";
import { Skeleton } from "@/components/ui/skeleton";

import { useEffect, useState } from "react";
import { capacitySchema, CapacityType } from "@/lib/types/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const valueFormatter = (number: number) =>
  new Intl.NumberFormat("us").format(number).toString();

export default function CapacityChart() {
  const [chartData, setChartData] = useState<CapacityType | null>(null);

  useEffect(() => {
    async function pullChartData() {
      try {
        const response = await fetch("/api/capacity");
        const data = await response.json();
        console.log(data);
        const parsedData = capacitySchema.parse(data);
        console.log({ parsedData });
        setChartData(parsedData);
      } catch (err) {
        console.error(err);
      }
    }
    pullChartData();
  }, []);

  if (chartData) {
    return (
      <Card className="grow">
        <CardHeader>
          <CardTitle>Available GPU capacity</CardTitle>
          <CardDescription>
            GPU-hours available for the next 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            className=" h-24"
            data={chartData}
            index="date"
            categories={["capacity"]}
            colors={["gray"]}
            valueFormatter={valueFormatter}
            startEndOnly={true}
            showAnimation={true}
            showLegend={false}
            // autoMinValue={true}
            yAxisWidth={48}
          />
        </CardContent>
      </Card>
    );
  } else {
    return (
      <div className="flex gap-2 grow">
        <Skeleton className="h-36 w-4" />
        <div className="flex flex-col gap-2 grow min-w-72">
          <Skeleton className="h-36" />
          <Skeleton className="h-4" />
        </div>
      </div>
    );
  }
}
