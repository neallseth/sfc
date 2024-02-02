import { formatAsUSD } from "@/lib/utils";
import { BadgeDelta, Flex, Metric, Text } from "@tremor/react";
import CapacityChart from "@/components/explore/CapacityChart";
import { SparkAreaChart, SparkLineChart, SparkBarChart } from "@tremor/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const chartdata = [
  {
    month: "Jan 21",
    Performance: 4000,
    Benchmark: 3000,
  },
  {
    month: "Feb 21",
    Performance: 3000,
    Benchmark: 2000,
  },
  {
    month: "Mar 21",
    Performance: 2000,
    Benchmark: 1700,
  },
  {
    month: "Apr 21",
    Performance: 2780,
    Benchmark: 2500,
  },
  {
    month: "May 21",
    Performance: 1890,
    Benchmark: 1890,
  },
  {
    month: "Jun 21",
    Performance: 2390,
    Benchmark: 2000,
  },
  {
    month: "Jul 21",
    Performance: 3490,
    Benchmark: 3000,
  },
];

export default function ExploreView() {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-12">
      <Card className="w-full md:max-w-60 p-6 flex flex-col justify-between gap-4 md:gap-6">
        <div>
          <Flex justifyContent="between" alignItems="center">
            <Text>$/GPU/hour</Text>
            <BadgeDelta
              className="ml-4"
              deltaType="moderateDecrease"
              isIncreasePositive={false}
              size="xs"
            >
              0.4%
            </BadgeDelta>
          </Flex>
          <Metric>{formatAsUSD(2.85)}</Metric>
        </div>
        <SparkAreaChart
          data={chartdata}
          categories={["Performance"]}
          index={"month"}
          colors={["emerald"]}
          className="h-10 w-full grow"
        />
      </Card>
      <CapacityChart />
    </div>
  );
}
