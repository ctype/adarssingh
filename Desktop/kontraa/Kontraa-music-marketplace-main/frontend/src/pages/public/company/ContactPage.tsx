import CustomInput from "@/components/form/CustomInput";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Box, Flex, Image, Textarea } from "@chakra-ui/react";

export default function ContactPage() {
  return (
    <Box backgroundColor={"#000"}>
      <Box h={"250px"}>
        <Image
          src="/images/contributer-banner.jpg"
          objectFit="cover"
          h={"full"}
          w={"full"}
        />
      </Box>

      <Flex
        direction={"column"}
        gap={4}
        alignItems={"center"}
        rounded={"md"}
        backgroundColor={"blackAlpha.900"}
        py={8}
        px={12}
      >
        <h3>Contact Us</h3>

        <form>
          <Flex direction={"column"} gap={3}>
            <Flex alignItems={"center"} gap={4}>
              <CustomInput
                label="First Name"
                name="firstName"
                placeholder="Enter your first name"
              />
              <CustomInput
                label="Last Name"
                name="lastName"
                placeholder="Enter your last name"
              />
            </Flex>

            <CustomInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
            />

            <CustomInput
              label="Phone number"
              name="phoneNumber"
              type="number"
              placeholder="Enter your phone number"
            />

            <Field label="Message">
              <Textarea
                placeholder="Write a message that you want to send us"
                _focus={{ borderColor: "blue.500", outlineColor: "blue.500" }}
              />
            </Field>

            <CustomInput
              label="Company's name"
              name="companyName"
              required={false}
              placeholder="Enter your company name"
            />

            <CustomInput
              label="Website"
              name="website"
              required={false}
              placeholder="Enter your website"
            />

            <Button backgroundColor={"blue.700"} color={"white"}>
              Send Message
            </Button>
          </Flex>
        </form>
      </Flex>
    </Box>
  );
}
