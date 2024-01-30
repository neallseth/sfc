import { formatAsUSD } from "@/lib/utils";
import { BadgeDelta, Card, Flex, Metric, Text } from "@tremor/react";

export default function ExploreView() {
  return (
    <Card className="max-w-sm">
      <Flex justifyContent="between" alignItems="center">
        <Text>GPUs/hour</Text>
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
  );
}
