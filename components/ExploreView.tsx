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
          2.4%
        </BadgeDelta>
      </Flex>
      <Metric> $2.85</Metric>
    </Card>
  );
}
