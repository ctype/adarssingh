import { overviewIcons } from "@/pages/utils/overview.util";
import { Box, Card, Flex } from "@chakra-ui/react";

interface IOverviewSectionProps {
  stats: Overview[];
}

export default function OverviewSection({ stats }: IOverviewSectionProps) {
  return (
    <Box>
      <h3>Overview</h3>
      <p>Quick overview of stats in the system</p>
      <Flex
        gap={4}
        w={"full"}
        direction={{ base: "column", md: "row" }}
        alignItems="center"
        mt={4}
      >
        {stats?.map((stat, index) => (
          <OverviewStatCard
            key={index}
            value={stat.value}
            description={stat.description}
            icon={overviewIcons[stat.name as keyof typeof overviewIcons]}
          />
        ))}
      </Flex>
    </Box>
  );
}

function OverviewStatCard({
  icon,
  value,
  description,
}: {
  icon: React.ReactNode;
  value: string | number;
  description: string;
}) {
  return (
    <Card.Root flex="1" h={"200px"} w={"full"}>
      <Card.Header>{icon}</Card.Header>
      {/* <Card.Body></Card.Body> */}
      <Card.Footer
        display={"flex"}
        flexDirection={"column"}
        alignItems={"start"}
        justifyContent={"end"}
        gap={2}
        w="full"
        h="full"
      >
        <h3>{value}</h3>
        <p>{description}</p>
      </Card.Footer>
    </Card.Root>
  );
}
