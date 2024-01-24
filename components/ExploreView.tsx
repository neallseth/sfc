import { BadgeDelta, Card, Flex, Metric, Text } from "@tremor/react";

export default function ExploreView() {
  return (
    <Card className="max-w-sm">
      <Flex justifyContent="between" alignItems="center">
        <Text>Sales</Text>
        <BadgeDelta
          deltaType="moderateIncrease"
          isIncreasePositive={true}
          size="xs"
        >
          +12.3%
        </BadgeDelta>
      </Flex>
      <Metric>$ 23,456</Metric>
    </Card>
  );
}
