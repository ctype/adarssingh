import { Check, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Card,
  Flex,
  Icon,
  Separator,
  Span,
  Tabs,
  Text,
} from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  fetchSubscriptionFeatures,
  fetchSubscriptionPackages,
} from "@/features/subscription/subscriptionSlice";
import { toaster } from "@/components/ui/toaster";
import { subscribeToPackage } from "@/features/system_user/systemUserSlice";
// import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";

const subpackages: {
  id: number;
  title: string;
  isPreferred: boolean;
  pricing:
    | {
        monthly: number;
        annually: number;
      }
    | "Custom";
  features: {
    description: string;
    helper: string | null;
    extraInfo: string | null;
  }[];
}[] = [
  {
    id: 1,
    title: "Free",
    isPreferred: false,
    pricing: {
      monthly: 0,
      annually: 0,
    },
    features: [
      {
        description: "Unlimited download",
        helper: "Download unlimited track files in mp3 format",
        extraInfo: null,
      },
      {
        description: "Social media platform connection",
        helper: "Showcase your social medias here in kontraa",
        extraInfo: null,
      },
      {
        description: "Mp3 File format",
        helper: null,
        extraInfo: null,
      },
    ],
  },
  {
    id: 2,
    title: "CREATOR+",
    isPreferred: false,
    pricing: {
      monthly: 7.99,
      annually: 79.9,
    },
    features: [
      {
        description: "Unlimited download",
        helper: "Download unlimited track files in mp3 format",
        extraInfo: null,
      },
      {
        description: "Social media platform connection",
        helper: "Showcase your social medias here in kontraa",
        extraInfo: null,
      },
      {
        description: "WAV File format",
        helper: null,
        extraInfo: null,
      },
      {
        description: "Monthly sample downolad",
        extraInfo: "10 Credits",
        helper: "Use credits to download pro files",
      },
      {
        description: "Monetize content",
        helper: null,
        extraInfo: "1 Channel",
      },
      {
        description: "Use in podcast",
        helper: "Can use in limited podcast",
        extraInfo: null,
      },
      {
        description: "Commercial Films",
        helper: "Can use in limited commercial flims",
        extraInfo: null,
      },
      {
        description: "Sample clearance token",
        helper: null,
        extraInfo: null,
      },
    ],
  },
  {
    id: 3,
    title: "PROFESSIONAL+",
    isPreferred: true,
    pricing: {
      monthly: 19.99,
      annually: 199.9,
    },
    features: [
      {
        description: "Unlimited download",
        helper: "Download unlimited track files in mp3 format",
        extraInfo: null,
      },
      {
        description: "Social media platform connection",
        helper: "Showcase your social medias here in kontraa",
        extraInfo: null,
      },
      {
        description: "WAV/Track-Out Streams File format",
        helper: null,
        extraInfo: null,
      },
      {
        description: "Monthly sample downolad",
        extraInfo: "30 Credits",
        helper: "Use credits to download pro files",
      },
      {
        description: "Monetize content",
        helper: null,
        extraInfo: "3 Channel",
      },
      {
        description: "Use in podcast",
        helper: "Can use in limited podcast",
        extraInfo: null,
      },
      {
        description: "Commercial Films",
        helper: "Can use in limited commercial flims",
        extraInfo: null,
      },
      {
        description: "Sample clearance token",
        helper: null,
        extraInfo: null,
      },
      {
        description: "Coverage client work",
        helper: null,
        extraInfo: null,
      },
    ],
  },
  {
    id: 4,
    title: "BUSINESS",
    isPreferred: false,
    pricing: "Custom",
    features: [
      {
        description: "Unlimited download",
        helper: "Download unlimited track files in mp3 format",
        extraInfo: null,
      },
      {
        description: "Social media platform connection",
        helper: "Showcase your social medias here in kontraa",
        extraInfo: null,
      },
      {
        description: "WAV/Track-Out Streams File format",
        helper: null,
        extraInfo: null,
      },
      {
        description: "Monthly sample downolad",
        extraInfo: "Custom credit available",
        helper: "Use credits to download pro files",
      },
      {
        description: "Monetize content",
        helper: null,
        extraInfo: "Unlimited",
      },
      {
        description: "Use in podcast",
        helper: "Can use in limited podcast",
        extraInfo: null,
      },
      {
        description: "Commercial Films",
        helper: "Can use in limited commercial flims",
        extraInfo: null,
      },
      {
        description: "Sample clearance token",
        helper: null,
        extraInfo: null,
      },
      {
        description: "Coverage client work",
        helper: null,
        extraInfo: null,
      },
      {
        description: "Video Game/Apps",
        helper: null,
        extraInfo: null,
      },
      {
        description: "TV & Radio Broadcast",
        helper: null,
        extraInfo: null,
      },
      {
        description: "SOD/OTT/VOD",
        helper: null,
        extraInfo: null,
      },
    ],
  },
];

export default function ProSubscribtionPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { myProfile } = useAppSelector((state) => state.systemUser);
  // const { subscriptionPackages, subscriptionFeatures, isPending } =
  //   useAppSelector((state) => state.subscription);

  const [pricingTenure, setPricingTenure] = useState<"monthly" | "annually">(
    "monthly"
  );

  const handlePackageSubscribe = async (id: number) => {
    if (!myProfile) {
      toaster.create({
        type: "error",
        title: "Please login first",
        action: {
          label: "Login",
          onClick: () => navigate("/auth/login"),
        },
        description: "You need to login inorder to download it",
      });
      return;
    }

    dispatch(subscribeToPackage(id))
      .unwrap()
      .then(() => {
        toaster.create({
          type: "success",
          title: "You have subscribed to the package",
        });
      });
  };

  useEffect(() => {
    dispatch(fetchSubscriptionPackages()).unwrap();
    dispatch(fetchSubscriptionFeatures()).unwrap();
  }, [dispatch]);

  return (
    <MaxWidthWrapper>
      <Flex direction="column" gap={6} my={8} alignItems={"center"}>
        <h3>Choose the plan that fits your taste.</h3>
        <Tabs.Root
          defaultValue="members"
          variant={"enclosed"}
          value={pricingTenure}
        >
          <Tabs.List backgroundColor={"gray.800/60"}>
            <Tabs.Trigger
              value="monthly"
              onClick={() => setPricingTenure("monthly")}
              color={"gray.400"}
              _selected={{
                backgroundColor: "blue.800/80",
                color: "white",
              }}
            >
              Monthly
            </Tabs.Trigger>
            <Tabs.Trigger
              value="annually"
              onClick={() => setPricingTenure("annually")}
              color={"gray.400"}
              _selected={{
                backgroundColor: "blue.800/80",
                color: "white",
              }}
            >
              Annually
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          {subpackages.map((pkg) => (
            <Card.Root
              key={pkg.title}
              w="full"
              flex={1}
              borderColor={pkg.isPreferred ? "blue.900" : "inherit"}
            >
              <Card.Header display={"flex"} flexDirection="column" gap={4}>
                <Flex
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  color={pkg.isPreferred ? "blue.400" : "white"}
                >
                  <h4>{pkg.title}</h4>
                  {pkg.isPreferred && (
                    <Badge colorPalette={"blue"} size="sm">
                      Recommended
                    </Badge>
                  )}
                </Flex>
                {pkg.pricing !== "Custom" ? (
                  <>
                    {pricingTenure === "monthly" ? (
                      <Box>
                        <Text as="span" fontSize="4xl">
                          ${pkg.pricing.monthly}
                        </Text>{" "}
                        / month
                      </Box>
                    ) : (
                      <Box>
                        <Text as="span" fontSize="4xl">
                          ${(pkg.pricing.annually / 12).toPrecision(2)}
                        </Text>
                        / month
                      </Box>
                    )}
                  </>
                ) : (
                  <Box py={7}></Box>
                )}
              </Card.Header>
              <Card.Body>
                {
                  <>
                    {myProfile?.userProPackage &&
                    myProfile.userProPackage.id === pkg.id ? (
                      <Text
                        w="full"
                        p={3}
                        rounded={"md"}
                        color="black"
                        backgroundColor="blue.200"
                        textAlign="center"
                      >
                        Your current package
                      </Text>
                    ) : (
                      <Button
                        w={"full"}
                        color={pkg.isPreferred ? "white" : "black"}
                        backgroundColor={pkg.isPreferred ? "blue.800" : "white"}
                        _hover={{
                          backgroundColor: pkg.isPreferred
                            ? "blue.700"
                            : "whiteAlpha.800",
                        }}
                        py={6}
                        onClick={() => handlePackageSubscribe(pkg.id)}
                      >
                        {myProfile?.userProPackage
                          ? "Change"
                          : pkg.pricing === "Custom"
                            ? "Contact Us"
                            : "Get started"}{" "}
                      </Button>
                    )}
                  </>
                }

                <Separator size="md" color="white" my={8} />

                <Flex direction="column" gap={2} alignItems={"start"}>
                  {pkg.features.map((pf) => {
                    return (
                      <Flex gap={4} alignItems={"center"} key={pf.description}>
                        <Icon
                          color={pkg.isPreferred ? "blue.400" : "white"}
                          strokeWidth={3}
                        >
                          <Check />
                        </Icon>
                        <p>
                          {pf.description}{" "}
                          {pf.extraInfo && (
                            <Text as="span" color={"blue.400"}>
                              ({pf.extraInfo})
                            </Text>
                          )}
                        </p>
                        {pf.helper && (
                          <Tooltip
                            positioning={{
                              placement: "top",
                            }}
                            content={pf.helper}
                            openDelay={150}
                            closeDelay={200}
                            // contentProps={{
                            //   css: {
                            //     "--tooltip-bg": "colors.gray.400",
                            //     "--tooltip-text": "colors.white",
                            //   },
                            // }}
                          >
                            <Span>
                              <Info width={"16px"} />
                            </Span>
                          </Tooltip>
                        )}
                      </Flex>
                    );
                  })}
                </Flex>
              </Card.Body>
            </Card.Root>
          ))}
          {/* {isPending ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} flex={1} h={"400px"} />
              ))}
            </>
          ) : (
            <>
              {subscriptionPackages.map((pkg) => (
                <Card.Root
                  key={pkg.id}
                  w="full"
                  flex={1}
                  borderColor={pkg.isPreferred ? "blue.900" : "inherit"}
                >
                  <Card.Header display={"flex"} flexDirection="column" gap={4}>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      color={pkg.isPreferred ? "blue.400" : "white"}
                    >
                      <h4>{pkg.name}</h4>
                      {pkg.isPreferred && (
                        <Badge colorPalette={"blue"} size="sm">
                          Recommended
                        </Badge>
                      )}
                    </Flex>
                    {pricingTenure === "monthly" ? (
                      <Box>
                        <Text as="span" fontSize="4xl">
                          ${pkg.priceMonthly}
                        </Text>{" "}
                        / month
                      </Box>
                    ) : (
                      <Box>
                        <Text as="span" fontSize="4xl">
                          ${(pkg.priceAnnually / 12).toPrecision(2)}
                        </Text>
                        / month
                      </Box>
                    )}
                  </Card.Header>
                  <Card.Body>
                    {
                      <>
                        {myProfile?.userProPackage &&
                        myProfile.userProPackage.id === pkg.id ? (
                          <Text
                            w="full"
                            p={3}
                            rounded={"md"}
                            color="black"
                            backgroundColor="blue.200"
                            textAlign="center"
                          >
                            Your current package
                          </Text>
                        ) : (
                          <Button
                            w={"full"}
                            color={pkg.isPreferred ? "white" : "black"}
                            backgroundColor={
                              pkg.isPreferred ? "blue.800" : "white"
                            }
                            _hover={{
                              backgroundColor: pkg.isPreferred
                                ? "blue.700"
                                : "whiteAlpha.800",
                            }}
                            py={6}
                            onClick={() => handlePackageSubscribe(pkg.id)}
                          >
                            {myProfile?.userProPackage
                              ? "Change"
                              : "Get started"}{" "}
                          </Button>
                        )}
                      </>
                    }

                    <Separator size="md" color="white" my={8} />

                    <Flex direction="column" gap={2} alignItems={"start"}>
                      {subscriptionFeatures.map((pf) => {
                        if (pkg.features?.find((feat) => feat.id === pf.id)) {
                          return (
                            <Flex gap={4} alignItems={"center"} key={pf.name}>
                              <Icon
                                color={pkg.isPreferred ? "blue.400" : "white"}
                                strokeWidth={3}
                              >
                                <Check />
                              </Icon>
                              <p>
                                {pf.name}{" "}
                                {pkg.packageFeatureValues?.find(
                                  (pfv) =>
                                    (
                                      (
                                        pfv as SubscriptionPackageFeatureLabelValue
                                      ).featureId as SubscriptionFeature
                                    ).id === pf.id
                                ) && (
                                  <Text as="span" color={"blue.400"}>
                                    (
                                    {
                                      (
                                        pkg.packageFeatureValues?.find(
                                          (pfv) =>
                                            (
                                              (
                                                pfv as SubscriptionPackageFeatureLabelValue
                                              ).featureId as SubscriptionFeature
                                            ).id === pf.id
                                        ) as SubscriptionPackageFeatureLabelValue
                                      )?.label
                                    }
                                    )
                                  </Text>
                                )}
                              </p>
                              {pf.helperText && (
                                <Tooltip
                                  positioning={{
                                    placement: "top",
                                  }}
                                  content={pf.helperText}
                                  openDelay={150}
                                  closeDelay={200}
                                  // contentProps={{
                                  //   css: {
                                  //     "--tooltip-bg": "colors.gray.400",
                                  //     "--tooltip-text": "colors.white",
                                  //   },
                                  // }}
                                >
                                  <Span>
                                    <Info width={"16px"} />
                                  </Span>
                                </Tooltip>
                              )}
                            </Flex>
                          );
                        }
                      })}
                    </Flex>
                  </Card.Body>
                </Card.Root>
              ))}
            </>
          )} */}
        </Flex>
      </Flex>
    </MaxWidthWrapper>
  );
}
