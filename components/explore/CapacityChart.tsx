import {
  AreaChart,
  BarChart,
  Card,
  Flex,
  Subtitle,
  Switch,
  Title,
} from "@tremor/react";
import { useEffect, useState } from "react";
import { capacitySchema, CapacityType } from "@/lib/types/schemas";

// const chartdata = [
//   {
//     name: "Amphibians",
//     "Number of threatened species": 2488,
//   },
//   {
//     name: "Birds",
//     "Number of threatened species": 1445,
//   },
//   {
//     name: "Crustaceans",
//     "Number of threatened species": 743,
//   },
//   {
//     name: "Ferns",
//     "Number of threatened species": 281,
//   },
//   {
//     name: "Arachnids",
//     "Number of threatened species": 251,
//   },
//   {
//     name: "Corals",
//     "Number of threatened species": 232,
//   },
//   {
//     name: "Algae",
//     "Number of threatened species": 98,
//   },
// ];

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
      <Card>
        <Title>Available GPU capacity</Title>
        <Subtitle>GPU-hours available for the next 30 days</Subtitle>
        <BarChart
          className="mt-6"
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
      </Card>
    );
  }
}
