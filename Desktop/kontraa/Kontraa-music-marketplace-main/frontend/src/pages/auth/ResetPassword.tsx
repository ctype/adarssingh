import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Flex, Link as ChakraLink } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import CustomPasswordInput from "@/components/form/CustomPasswordInput";
import { resetPassword } from "@/features/auth/authSlice";
import { useCrudResource } from "@/hooks/useCrudResource";

export default function ResetPassword() {
  const { token } = useParams();
  const [error, setError] = useState<dynamicStringObj>({});

  const { updateResource, validationError } = useCrudResource({
    resourceName: "password",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError({
        confirmPassword: "Passwords do not match",
        password: "Passwords do not match",
      });
      return;
    }

    await updateResource(resetPassword, {
      newPassword: password,
      token: token!,
    });
  };

  return (
    <Flex
      as="main"
      alignItems={"center"}
      justifyContent={"center"}
      w={"100vw"}
      h={"100vh"}
      backgroundColor={"#000"}
    >
      <Flex
        alignItems={"center"}
        backgroundColor={"gray.900"}
        direction={"column"}
        rounded={"xl"}
        w={{ base: "90%", md: "25%" }}
        p={8}
        gap={2}
      >
        <h5>Reset Password?</h5>

        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", marginBlockEnd: "1em" }}
        >
          <Flex gap={4} direction={"column"}>
            <CustomPasswordInput
              name="password"
              label="Password"
              placeholder="Enter your password"
              error={error["password"] ?? validationError["password"]}
            />

            <CustomPasswordInput
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm the password"
              error={error["confirmPassword"]}
            />
          </Flex>

          <Button
            type="submit"
            w={"full"}
            backgroundColor={"blue.600"}
            mt={4}
            color={"white"}
            // disabled={isPending}
          >
            Reset Password
          </Button>
        </form>

        <Flex gap={2}>
          <p>No need to reset password anymore?</p>
          <ChakraLink
            asChild
            color={"blue.300"}
            fontWeight={"bold"}
            textDecoration={"underline"}
          >
            <Link to="/auth/login">Log in</Link>
          </ChakraLink>
        </Flex>
      </Flex>
    </Flex>
  );
}
