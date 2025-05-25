import { Box } from "@chakra-ui/react";
import { Swiper } from "swiper/react";
import "swiper/swiper-bundle.css";

export default function SwiperCardLayout({
  children,
  breakpoints,
}: {
  children: React.ReactNode;
  breakpoints?: {
    [key: number]: {
      slidesPerView: number;
      spaceBetween: number;
    };
  };
}) {
  return (
    <Box w="full">
      <Swiper
        slidesPerView={1.5}
        spaceBetween={5}
        breakpoints={
          breakpoints ?? {
            624: {
              slidesPerView: 2.5,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            968: {
              slidesPerView: 3.7,
              spaceBetween: 10,
            },
            1098: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 4.5,
              spaceBetween: 30,
            },
            1536: {
              slidesPerView: 5,
              spaceBetween: 40,
            },
            1898: {
              slidesPerView: 6.1,
              spaceBetween: 45,
            },
          }
        }
      >
        {children}
      </Swiper>
    </Box>
  );
}
