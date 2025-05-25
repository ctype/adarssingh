import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant={"outline"}
      p={2}
      borderColor={"gray.700"}
      color={"white"}
      _hover={{
        backgroundColor: "gray.700",
      }}
      onClick={() => navigate(-1)}
      mb={4}
    >
      <ArrowLeft />
    </Button>
  )
}