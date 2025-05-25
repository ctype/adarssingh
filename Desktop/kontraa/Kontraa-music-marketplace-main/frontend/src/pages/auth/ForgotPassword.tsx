import { Link } from "react-router-dom";
import { Flex, Link as ChakraLink } from "@chakra-ui/react";

import { useAppDispatch } from "@/app/store";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/form/CustomInput";
import { forgotPassword } from "@/features/auth/authSlice";
import { toaster } from "@/components/ui/toaster";

export default function ForgotPassword() {
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;

    await dispatch(forgotPassword(email))
      .unwrap()
      .then((d) => {
        if (d.forgotPassword) {
          toaster.create({
            type: "success",
            title: "Reset password mail sent",
            description: "Please, check your provided email for reset link",
          });
        }
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
        <h5>Forgot Password?</h5>

        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", marginBlockEnd: "1em" }}
        >
          <Flex gap={4} direction={"column"}>
            <CustomInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              // error={error}
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
            Send Reset Link
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
