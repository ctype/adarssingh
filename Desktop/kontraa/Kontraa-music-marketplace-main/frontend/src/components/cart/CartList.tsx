import { X } from "lucide-react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAppDispatch } from "@/app/store";
import { removeFromCart } from "@/features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

export default function CartList({ carts }: { carts: CartResponse[] }) {
  const navigate = useNavigate();

  return (
    <Flex direction={"column"} alignItems={"start"} gap={2} width={"full"}>
      {carts.length <= 0 ? (
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          w={"full"}
          textAlign={"center"}
          h={"100px"}
          direction={"column"}
          gap={4}
        >
          <Text>Your cart is empty</Text>
          <Button
            colorPalette={"blue"}
            onClick={() => navigate("/tracks")}
            // size={"xs"}
          >
            Explore Music
          </Button>
        </Flex>
      ) : (
        <>
          {carts.map((c) => (
            <CartCard key={c.id} cart={c} />
          ))}
        </>
      )}
    </Flex>
  );
}

function CartCard({ cart }: { cart: CartResponse }) {
  const dispatch = useAppDispatch();

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(cart.id)).unwrap();
  };

  return (
    <Box
      _hover={{
        backgroundColor: "gray.900",
      }}
      px={4}
      py={2}
      w={"full"}
      rounded={"sm"}
    >
      <Box display={"flex"} justifyContent={"space-between"} w={"full"}>
        <HStack gap={6} w={"full"}>
          <Image
            src={import.meta.env.VITE_AWS_BUCKET_LINK + cart.artWorkFilePath}
            alt={cart.title}
            rounded={"sm"}
            w={24}
            h={20}
          />

          <VStack gap={2} alignSelf={"center"}>
            <Box>
              <Text fontSize={18}>{cart.title}</Text>
              <Text fontSize={14} color={"gray.400"} alignSelf={"self-start"}>
                track
              </Text>
            </Box>
            <Text alignSelf={"self-start"} color={"blue.500"}>
              ${cart.price}
            </Text>
          </VStack>
        </HStack>
        <Button
          bg={"none"}
          color={"white"}
          onClick={handleRemoveFromCart}
          alignSelf={"center"}
        >
          <X />
        </Button>
      </Box>
    </Box>
  );
}
