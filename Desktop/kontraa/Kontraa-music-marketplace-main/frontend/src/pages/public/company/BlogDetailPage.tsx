import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import { Flex, Image, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BlogDetailPage() {
  const navigate = useNavigate();

  return (
    <MaxWidthWrapper>
      <Flex direction={"column"} gap={4}>
        <Button
          onClick={() => navigate(-1)}
          variant={"outline"}
          p={2}
          w={"fit"}
          color={"white"}
          borderColor={"gray.700"}
          _hover={{ backgroundColor: "gray.700" }}
        >
          <ArrowLeft />
        </Button>
        <Image
          src="/images/hero.png"
          h={400}
          w={"full"}
          objectFit={"cover"}
          borderRadius="lg"
        />
        <Text>
          This sofa is perfect for modern tropical spaces, baroque inspired
          spaces, earthy toned spaces and for people who love a chic design with
          a sprinkle of vintage design.
        </Text>
      </Flex>
    </MaxWidthWrapper>
  );
}
