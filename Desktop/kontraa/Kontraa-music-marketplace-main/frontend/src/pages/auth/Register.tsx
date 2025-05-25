import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flex, Link as ChakraLink } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/form/CustomInput";
import { registerWithEmail } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import CustomPasswordInput from "@/components/form/CustomPasswordInput";
import { setMyProfile } from "@/features/system_user/systemUserSlice";
import { toaster } from "@/components/ui/toaster";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<dynamicStringObj>({});

  const handleSubmit = async (e: React.FormEvent) => {
    setError({});

    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const username = formData.get("userName") as string;

    if (username.includes("#")) {
      setError({
        username: "Username cannot contain '#'",
      });
      return;
    }

    if (password !== confirmPassword) {
      setError({
        confirmPassword: "Passwords do not match",
        password: "Passwords do not match",
      });
      return;
    }

    setIsPending(true);

    await dispatch(
      registerWithEmail({ email, password, firstName, lastName, username })
    )
      .unwrap()
      .then((d) => {
        if (d.register.user) {
          dispatch(setMyProfile(d.register.user));
        }
        if (d.register.error) {
          setError({
            [d.register.error.errors[0]["field"]]:
              d.register.error.errors[0]["message"],
          });
        }
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  useEffect(() => {
    if (!isPending) {
      if (user && Object.keys(error).length <= 0) {
        localStorage.setItem("user", JSON.stringify(user));
        toaster.create({
          type: "success",
          title: "Registered",
          description: "Please check your mail for verification",
          duration: 3000,
        });
      }
    }
  }, [user, isPending, navigate, error]);

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
        w={{ base: "90%", md: "40%" }}
        p={8}
        gap={2}
      >
        <h5>Register</h5>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Flex gap={4} direction={"column"}>
            <CustomInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={error && error["email"]}
            />

            <Flex gap={2}>
              <CustomInput
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
              />

              <CustomInput
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
              />
            </Flex>

            <CustomInput
              name="userName"
              label="Username"
              placeholder="Enter a username"
              error={error["username"] as string}
            />

            <CustomPasswordInput
              name="password"
              label="Password"
              placeholder="Enter your password"
              error={error["password"] as string}
            />

            <CustomPasswordInput
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm the password"
              error={error["confirmPassword"] as string}
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
            Sign up
          </Button>
          {/* <Flex alignItems={"center"} justifyContent={"center"}>
            <hr />
            <Text mx={4}>OR</Text>
            <hr />
          </Flex>

          <Button
            type="button"
            w={"full"}
            backgroundColor={"white"}
            color={"#000"}
            display={"flex"}
            gap={4}
            mt={4}
          >
            <FaGoogle />
            Google
          </Button> */}
        </form>

        <Flex gap={2}>
          <p>Already have an account?</p>
          <ChakraLink
            asChild
            color={"blue.300"}
            fontWeight={"bold"}
            textDecoration={"underline"}
          >
            <Link to="/auth/login">Login</Link>
          </ChakraLink>
        </Flex>
      </Flex>
    </Flex>
  );
}
