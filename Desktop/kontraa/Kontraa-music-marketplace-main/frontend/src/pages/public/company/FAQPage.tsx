import { PropsWithChildren } from "react";
import { Flex } from "@chakra-ui/react";

import faqs from "@/utils/faqs";
import CustomAccordion from "@/components/global/CustomAccordion";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";

export default function FAQPage() {
  return (
    <MaxWidthWrapper>
      <Flex direction={"column"} my={10} alignItems={"center"}>
        <h3>Frequently Asked Questions</h3>
        <Flex direction={{ base: "column", md: "row" }} my={10} gap={20}>
          <Flex direction={"column"} gap={8} flex={1}>
            <FaqSection title="General">
              <CustomAccordion
                items={faqs.general.map((faq) => ({
                  value: faq.title,
                  title: faq.title,
                  content: faq.answer,
                }))}
                selectedDefaultValue={faqs.general[0].title}
              />
            </FaqSection>

            <FaqSection title="Licensing and Rights Management">
              <CustomAccordion
                items={faqs.licensing.map((faq) => ({
                  value: faq.title,
                  title: faq.title,
                  content: faq.answer,
                }))}
                selectedDefaultValue={""}
              />
            </FaqSection>
          </Flex>

          <Flex direction={"column"} gap={8} flex={1}>
            <FaqSection title="Contributer Information">
              <CustomAccordion
                items={faqs.contributorInfo.map((faq) => ({
                  value: faq.title,
                  title: faq.title,
                  content: faq.answer,
                }))}
                selectedDefaultValue={faqs.contributorInfo[0].title}
              />
            </FaqSection>

            <FaqSection title="Subscription and Download Options">
              <CustomAccordion
                items={faqs.subscribtion.map((faq) => ({
                  value: faq.title,
                  title: faq.title,
                  content: faq.answer,
                }))}
                selectedDefaultValue={""}
              />
            </FaqSection>

            <FaqSection title="Security and Privacy">
              <CustomAccordion
                items={faqs.security.map((faq) => ({
                  value: faq.title,
                  title: faq.title,
                  content: faq.answer,
                }))}
                selectedDefaultValue={""}
              />
            </FaqSection>

            <FaqSection title="Technical Support and Troubleshooting">
              <CustomAccordion
                items={faqs.technical.map((faq) => ({
                  value: faq.title,
                  title: faq.title,
                  content: faq.answer,
                }))}
                selectedDefaultValue={""}
              />
            </FaqSection>

            <FaqSection title="Payments and Payouts">
              <CustomAccordion
                items={faqs.payments.map((faq) => ({
                  value: faq.title,
                  title: faq.title,
                  content: faq.answer,
                }))}
                selectedDefaultValue={""}
              />
            </FaqSection>
          </Flex>
        </Flex>
      </Flex>
    </MaxWidthWrapper>
  );
}

const FaqSection = (props: PropsWithChildren<{ title: string }>) => {
  const { title, children } = props;
  return (
    <Flex direction={"column"} gap={3} alignItems={"start"}>
      <h4>{title}</h4>
      {children}
    </Flex>
  );
};
