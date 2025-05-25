import { useEffect } from "react";
import {
  resendVerificationEmail,
  verifyEmail,
} from "@/features/auth/authSlice";
import { useCrudResource } from "@/hooks/useCrudResource";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { toaster } from "@/components/ui/toaster";

export default function EmailVerification() {
  const { email } = useParams();
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const token = searchParams[0].get("token");

  const { updateResource, createResource } = useCrudResource({
    resourceName: "verified",
    onSuccess: () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role) {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        }
        if (user.role === "user") {
          navigate("/users/dashboard");
        }
        if (user.role === "contributor") {
          navigate("/contributors/dashboard");
        }
      } else {
        toaster.create({
          title: "Succefully verified",
          description: "You can now login",
          action: {
            label: "login",
            onClick: () => navigate("/auth/login"),
          },
        });
      }
    },
    onError: (err) => {
      toaster.create({
        type: "error",
        title: "Cannot verify your email",
        description: err.message,
        action: {
          label: "Resend email verification",
          onClick: () => {
            resendVerfiyMail();
          },
        },
      });
    },
  });

  const resendVerfiyMail = async () => {
    await createResource(resendVerificationEmail, { email: email! });
  };

  useEffect(() => {
    if (email && token) {
      updateResource(verifyEmail, { email, token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      as="main"
      alignItems={"center"}
      justifyContent={"center"}
      w={"100vw"}
      h={"100svh"}
      backgroundColor={"#000"}
    >
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        backgroundColor={"gray.900"}
        direction={"column"}
        rounded={"xl"}
        w={{ base: "90%", md: "45%" }}
        p={8}
        gap={2}
      >
        <h4>Verifying your email</h4>

        <Text textAlign="center">
          Please wait a moment while we verify your email
        </Text>

        <Box
          position="fixed"
          width="100%"
          height="100svh"
          backgroundColor={"blackAlpha.200"}
          display={"flex"}
          alignItems={"start"}
          justifyContent={"center"}
          paddingTop={"35svh"}
        >
          <Loader size={48} />
        </Box>
      </Flex>
    </Flex>
  );
}
