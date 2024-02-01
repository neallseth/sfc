import { formatAsUSD } from "@/lib/utils";
import { BadgeDelta, Card, Flex, Metric, Text } from "@tremor/react";
import CapacityChart from "@/components/explore/CapacityChart";

export default function ExploreView() {
  return (
    <div>
      <Card className="max-w-sm">
        <Flex justifyContent="between" alignItems="center">
          <Text>$/GPU/hour</Text>
          <BadgeDelta
            deltaType="moderateIncrease"
            isIncreasePositive={true}
            size="xs"
          >
            2%
          </BadgeDelta>
        </Flex>
        <Metric>{formatAsUSD(2.85)}</Metric>
      </Card>

      <CapacityChart />
    </div>
  );
}
