import { SwiperSlide } from "swiper/react";
import { Box, Flex, Heading, Link } from "@chakra-ui/react";

import SwiperCardLayout from "@/layouts/SwiperCardLayout";
import ProfileAudioCardTemplate from "@/components/music/ProfileAudioCardTemplate";
import "swiper/swiper-bundle.css";

interface IProfileContentsProps {
  audios: Partial<Track>[];
  presets: Partial<Preset>[];
  soundBanks: Partial<SoundBank>[];
  soundEffects: Partial<SoundEffect>[];
}

const getPrice = (priceString?: string): string => {
  if (!priceString) return "N/A";
  const parts = priceString.split("*");
  return parts[1] ?? "N/A";
};

export default function ProfileContents({
  audios,
  presets,
  soundBanks,
  soundEffects,
}: IProfileContentsProps) {
  return (
    <Box w={"78vw"}>
      {/* Tracks */}
      {audios.length > 0 && (
        <Flex direction="column" py={4}>
          <Flex alignItems="center" justifyContent="space-between" w="full" my={3}>
            <Heading as="h4" my={2}>Tracks</Heading>
            <Link href="/" color="white">See more</Link>
          </Flex>

          <SwiperCardLayout
            breakpoints={{
              624: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 2.5, spaceBetween: 40 },
              968: { slidesPerView: 2.7, spaceBetween: 10 },
              1098: { slidesPerView: 3.5, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 30 },
              1536: { slidesPerView: 4.5, spaceBetween: 40 },
            }}
          >
            {audios.map((track, key) => {
              const price = getPrice(track?.exclusiveOneTimeBuyPrices?.[0]);
              console.log("Track:", track);
              return (
                <SwiperSlide key={key}>
                  <ProfileAudioCardTemplate
                    key={key}
                    imageUrl={
                      import.meta.env.VITE_AWS_BUCKET_LINK +
                      (track.artworkFile ?? "default.jpg")
                    }
                    price={`$${price}`}
                    trackName={track.title ?? "Untitled"}
                    navigatePath={`/tracks/${track.id}`}
                  />
                </SwiperSlide>
              );
            })}
          </SwiperCardLayout>
        </Flex>
      )}

      {/* Sound Banks */}
      {soundBanks.length > 0 && (
        <Flex direction="column" py={4}>
          <Flex alignItems="center" justifyContent="space-between" w="full" my={3}>
            <Heading as="h4" my={2}>Sound Banks</Heading>
            <Link href="/" color="white">See more</Link>
          </Flex>

          <SwiperCardLayout
            breakpoints={{
              624: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 2.5, spaceBetween: 40 },
              968: { slidesPerView: 2.7, spaceBetween: 10 },
              1098: { slidesPerView: 3.5, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 30 },
              1536: { slidesPerView: 4.5, spaceBetween: 40 },
            }}
          >
            {soundBanks.map((soundBank, key) => {
              const price = getPrice(soundBank?.exclusiveOneTimeBuyPrices?.[0]);
              console.log("SoundBank:", soundBank);
              return (
                <SwiperSlide key={key}>
                  <ProfileAudioCardTemplate
                    key={key}
                    imageUrl={
                      import.meta.env.VITE_AWS_BUCKET_LINK +
                      (soundBank.artworkFile ?? "default.jpg")
                    }
                    price={`$${price}`}
                    isTrack={false}
                    navigatePath={`/sound-banks/${soundBank.id}`}
                    trackName={soundBank.title ?? "Untitled"}
                    trackCount={soundBank.numberOfFiles ?? 0}
                  />
                </SwiperSlide>
              );
            })}
          </SwiperCardLayout>
        </Flex>
      )}

      {/* Presets */}
      {presets.length > 0 && (
        <Flex direction="column" py={4}>
          <Flex alignItems="center" justifyContent="space-between" w="full" my={3}>
            <Heading as="h4" my={2}>Presets</Heading>
            <Link href="/" color="white">See more</Link>
          </Flex>

          <SwiperCardLayout
            breakpoints={{
              624: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 2.5, spaceBetween: 40 },
              968: { slidesPerView: 2.7, spaceBetween: 10 },
              1098: { slidesPerView: 3.5, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 30 },
              1536: { slidesPerView: 4.5, spaceBetween: 40 },
            }}
          >
            {presets.map((preset, key) => {
              const price = getPrice(preset?.exclusiveOneTimeBuyPrices?.[0]);
              console.log("Preset:", preset);
              return (
                <SwiperSlide key={key}>
                  <ProfileAudioCardTemplate
                    key={key}
                    imageUrl={
                      import.meta.env.VITE_AWS_BUCKET_LINK +
                      (preset.artworkFile ?? "default.jpg")
                    }
                    price={`$${price}`}
                    trackName={preset.title ?? "Untitled"}
                    isTrack={false}
                    navigatePath={`/presets/${preset.id}`}
                    trackCount={preset.numberOfFiles ?? 0}
                  />
                </SwiperSlide>
              );
            })}
          </SwiperCardLayout>
        </Flex>
      )}

      {/* Sound Effects */}
      {soundEffects.length > 0 && (
        <Flex direction="column" py={4}>
          <Flex alignItems="center" justifyContent="space-between" w="full" my={3}>
            <Heading as="h4" my={2}>Sound Effects</Heading>
            <Link href="/" color="white">See more</Link>
          </Flex>

          <SwiperCardLayout
            breakpoints={{
              624: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 2.5, spaceBetween: 40 },
              968: { slidesPerView: 2.7, spaceBetween: 10 },
              1098: { slidesPerView: 3.5, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 30 },
              1536: { slidesPerView: 4.5, spaceBetween: 40 },
            }}
          >
            {soundEffects.map((soundEffect, key) => {
              console.log("SoundEffect:", soundEffect);
              return (
                <SwiperSlide key={key}>
                  <ProfileAudioCardTemplate
                    imageUrl={
                      import.meta.env.VITE_AWS_BUCKET_LINK +
                      (soundEffect.soundEffectArtworkFile ?? "default.jpg")
                    }
                    trackName={soundEffect.soundEffectTitle ?? "Untitled"}
                    isTrack={false}
                    isSoundEffect={true}
                    navigatePath=""
                  />
                </SwiperSlide>
              );
            })}
          </SwiperCardLayout>
        </Flex>
      )}
    </Box>
  );
}
