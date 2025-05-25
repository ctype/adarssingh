import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell, ShoppingCart, Upload } from "lucide-react";
import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";

import { Avatar } from "../ui/avatar";
import CartList from "../cart/CartList";
import CustomMenu from "../global/CustomMenu";
import { LinkButton } from "../ui/link-button";
import { FormDialog } from "../form/FormDialog";
import { logout } from "@/features/auth/authSlice";
import { clearCarts, fetchCarts } from "@/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import CustomDrawer from "../global/CustomDrawer";
import CustomPopOver from "../global/CustomPopOver";
import {
  clearNotifications,
  fetchMyNotifications,
  readNotification,
} from "@/features/notification/notificationSlice";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";

export default function Navbar({
  isDashboardNav = false,
}: {
  isDashboardNav?: boolean;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { carts } = useAppSelector((state) => state.carts);
  const { notifications } = useAppSelector((state) => state.notifications);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    dispatch(clearCarts());
    dispatch(clearNotifications());
    await dispatch(logout());
  };

  const handleReadNotification = async (
    id: number,
    link: string,
    type: number,
    hasBeenRead: boolean
  ) => {
    if (type === 0 && !hasBeenRead) {
      await dispatch(readNotification({ id }))
        .unwrap()
        .finally(() => {
          navigate(link);
        });
    } else {
      navigate(link);
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchCarts({ userId: user.id })).unwrap();
      dispatch(fetchMyNotifications({ userId: user.id })).unwrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Box
      // px={px}
      color={"white"}
      background="transparent"
      backdropFilter={"blur(4px)"}
      zIndex={1}
    >
      <MaxWidthWrapper isDashboard={isDashboardNav}>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          py={4}
          gap={2}
        >
          <Flex alignItems={"center"} gap={2}>
            <Link to={"/"} className="">
              <Flex alignItems={"center"} gap={2}>
                <Avatar name="Kontraa" src="/images/logo.png" />
                <Text display={{ base: "none", md: "inline-block" }}>
                  KONTRAA
                </Text>
              </Flex>
            </Link>
          </Flex>

          <HStack fontSize="lg" cursor="pointer" gap={2}>
            {/* {!user ||
              (user?.role === "contributor" && ( */}
            <Text color={"white"} fontSize={"base"} mr={4}>
              <Link to={"/tracks"}>Explore</Link>
            </Text>

            {/* TODO: Enable in next release */}
            {(!user || user?.role === "user") && (
              <Text color={"white"} fontSize={"base"} mr={4}>
                <Link to={"/pricing"}>Pricing</Link>
              </Text>
            )}
            {/* ))} */}
            {!user ? (
              <>
                <Text>
                  <Link to="/auth/login">Log in</Link>
                </Text>
                {/* {!user ||
              (user?.role === "contributor" && ( */}
                <LinkButton
                  href={"/contributors/tracks/add"}
                  backgroundColor={"blue.600"}
                  color={"white"}
                  _hover={{
                    backgroundColor: "blue.700",
                  }}
                  size={"sm"}
                >
                  <Upload />
                  upload
                </LinkButton>
                {/* ))} */}
              </>
            ) : (
              <>
                {user?.role === "contributor" && (
                  <>
                    {/* {!user ||
              (user?.role === "contributor" && ( */}
                    <LinkButton
                      href={"/contributors/tracks/add"}
                      backgroundColor={"blue.600"}
                      color={"white"}
                      _hover={{
                        backgroundColor: "blue.700",
                      }}
                      size={"sm"}
                    >
                      <Upload />
                      upload
                    </LinkButton>
                    {/* ))} */}
                  </>
                )}
                {user?.role !== "admin" && (
                  <>
                    <CustomDrawer
                      title={"Your Cart"}
                      trigger={
                        <HStack gap={0} position="relative" p={0}>
                          <ShoppingCart color={"white"} />
                          <Text
                            position="absolute"
                            right={-2}
                            top={-2}
                            fontWeight="medium"
                            color="red"
                          >
                            {carts.length}
                          </Text>
                        </HStack>
                      }
                    >
                      <CartList carts={carts} />
                    </CustomDrawer>
                    <CustomPopOver
                      trigger={
                        <HStack gap={0} position="relative" p={0}>
                          <Bell color={"white"} />
                          <Text
                            position="absolute"
                            right={-2}
                            top={-2}
                            fontWeight="medium"
                            color="red"
                          >
                            {notifications.filter((n) => !n.hasBeenRead).length}
                          </Text>
                        </HStack>
                      }
                    >
                      {notifications.length <= 0 && (
                        <Flex
                          width={"full"}
                          height={"200px"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <Text>No new notifications</Text>
                        </Flex>
                      )}
                      {notifications.map((n) => (
                        <Flex
                          key={n.id}
                          alignItems={"center"}
                          gap={2}
                          _hover={{ backgroundColor: "gray.900/30" }}
                          p={2}
                          rounded={"sm"}
                          cursor={"pointer"}
                          onClick={() =>
                            handleReadNotification(
                              n.id,
                              n.redirectLink,
                              n.type,
                              n.hasBeenRead
                            )
                          }
                        >
                          <Image
                            src={
                              n.notificationImageUrl.startsWith("https")
                                ? n.notificationImageUrl
                                : import.meta.env.VITE_AWS_BUCKET_LINK +
                                  n.notificationImageUrl
                            }
                            alt={"notification image"}
                            width={"50px"}
                            height={"50px"}
                            rounded={"md"}
                          />
                          <Box>
                            <Text
                              fontWeight={"bold"}
                              color={n.hasBeenRead ? "gray.400" : "white"}
                            >
                              {n.title}
                            </Text>
                            <Text color={n.hasBeenRead ? "gray.400" : "white"}>
                              {n.summary}
                            </Text>
                          </Box>
                        </Flex>
                      ))}
                    </CustomPopOver>
                  </>
                )}
                <CustomMenu
                  menus={
                    user && user.role === "contributor"
                      ? [
                          {
                            name: "Profile",
                            value: `/profile/${user?.username}`,
                            isLink: true,
                          },
                          {
                            name: "Dashboard",
                            value:
                              user?.role === "contributor"
                                ? "/contributors/dashboard"
                                : "/users/dashboard",
                            isLink: true,
                          },
                          {
                            name: "Logout",
                            value: "logout",
                            isLink: false,
                            isDanger: true,
                            onClick: () => setIsLogoutDialogOpen(true),
                          },
                        ]
                      : [
                          {
                            name: "Dashboard",
                            value:
                              user?.role === "admin"
                                ? "/admin/dashboard"
                                : user?.role === "contributor"
                                  ? "/contributors/dashboard"
                                  : "/users/dashboard",
                            isLink: true,
                          },
                          {
                            name: "Logout",
                            value: "logout",
                            isLink: false,
                            isDanger: true,
                            onClick: () => setIsLogoutDialogOpen(true),
                          },
                        ]
                  }
                >
                  <Avatar
                    name={`profile picture of ${user.firstName}`}
                    src={
                      user.profilePath
                        ? import.meta.env.VITE_AWS_BUCKET_LINK +
                          user.profilePath
                        : "https://bit.ly/dan-abramov"
                    }
                  />
                </CustomMenu>
              </>
            )}
          </HStack>
        </Flex>

        <FormDialog
          yesText="Logout"
          isNotForm
          open={isLogoutDialogOpen}
          setOpen={setIsLogoutDialogOpen}
          handleCancel={() => setIsLogoutDialogOpen(false)}
          title="Do you want to logout?"
          handleSubmit={() => {}}
          handleOk={handleLogout}
          yesBgColor="red.700"
        >
          <Text>You are always welcome to come back anytime.</Text>
        </FormDialog>
      </MaxWidthWrapper>
    </Box>
  );
}
