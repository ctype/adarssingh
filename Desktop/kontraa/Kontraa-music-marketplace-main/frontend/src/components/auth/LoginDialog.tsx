import { FaGoogle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flex, Text, Link as ChakraLink } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/form/CustomInput";
import { loginWithEmail } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import CustomPasswordInput from "@/components/form/CustomPasswordInput";
import { setSystemUser } from "@/features/system_user/systemUserSlice";

export default function LoginDialog() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isPending, setIsPending] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await dispatch(loginWithEmail({ email, password }))
      .unwrap()
      .then((d) => {
        if (d.login.user) {
          dispatch(setSystemUser(d.login.user));
        }
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  useEffect(() => {
    if (!isPending) {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        }
        if (user.role === "contributor") {
          navigate("/contributors/dashboard");
        }
        if (user.role === "user") {
          navigate("/users/dashboard");
        }
      }
    }
  }, [user, isPending, navigate]);

  return (
    <Flex
      as="main"
      alignItems={"center"}
      justifyContent={"center"}
      w={"full"}
      h={"full"}
      p={4}
      backgroundColor={"#000"}
    >
      <Flex
        alignItems={"center"}
        backgroundColor={"gray.900"}
        direction={"column"}
        rounded={"xl"}
        minW={"400px"}
        p={8}
        gap={2}
      >
        <h5>Sign In</h5>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Flex gap={4} direction={"column"}>
            <CustomInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              // error={error}
            />

            <CustomPasswordInput
              name="password"
              label="Password"
              placeholder="Enter your password"
              // error={error}
            />

            <Flex justifyContent={"flex-end"}>
              <ChakraLink asChild color={"#ccc"}>
                <Link to="/auth/forgot-password">Forgot password?</Link>
              </ChakraLink>
            </Flex>
          </Flex>

          <Button
            type="submit"
            w={"full"}
            backgroundColor={"blue.600"}
            my={4}
            disabled={isPending}
            color={"white"}
          >
            Login
          </Button>

          <Flex alignItems={"center"} justifyContent={"center"}>
            <hr />
            <Text mx={4}>OR</Text>
            <hr />
          </Flex>

          <Button
            type="button"
            w={"full"}
            display={"flex"}
            backgroundColor={"white"}
            color={"#000"}
            gap={4}
            mt={4}
          >
            <FaGoogle />
            Google
          </Button>
        </form>

        <Flex gap={2}>
          <p>Dont have an account?</p>
          <ChakraLink
            asChild
            color={"blue.300"}
            fontWeight={"bold"}
            textDecoration={"underline"}
          >
            <Link to="/auth/register">Sign Up</Link>
          </ChakraLink>
        </Flex>
      </Flex>
    </Flex>
  );
}
