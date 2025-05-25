import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { SwiperSlide } from "swiper/react";
import { Box, Flex, Image } from "@chakra-ui/react";
import "swiper/swiper-bundle.css";

import { Button } from "@/components/ui/button";
import MusicCard from "@/components/music/MusicCard";
import SwiperCardLayout from "@/layouts/SwiperCardLayout";
import HeroSection from "@/components/landing/HeroSection";
import GenreArtistCard from "@/components/music/GenreArtistCard";
import PublicSearchInput from "@/components/landing/PublicSearchInput";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import { LinkButton } from "@/components/ui/link-button";
import { compatibleList } from "@/constants/compatible";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchAudios } from "@/features/audio/audioSlice";
import MusicCardSkeleton from "@/components/loader/MusicCardSkeleton";
import ContributorCardSkeleton from "@/components/loader/ContributorCardSkeleton";
import GenreCardSkeleton from "@/components/loader/GenreCardSkeleton";
import { fetchGenres } from "@/features/genre/genreSlice";
import { apolloClientQuery } from "@/apollo/apolloHelper";
import { TOP_CONTRIBUTORS } from "@/graphql/query/public/contributorPublic.query";

export default function LandingPage() {
  const dispatch = useAppDispatch();
  const { audios, isPending } = useAppSelector((state) => state.audios);
  const { genres, isPending: genreFetching } = useAppSelector(
    (state) => state.genres
  );
  const [topContributors, setTopContributors] = useState<Partial<User>[]>([]);
  const [fetchingTopContributors, setFetchingTopContributors] = useState(true);

  useEffect(() => {
    try {
      dispatch(fetchAudios({ filter: { status: 1, isDraft: false } })).unwrap();
      dispatch(fetchGenres()).unwrap();

      (async () => {
        const result = await apolloClientQuery(TOP_CONTRIBUTORS, {});
        if (result.topContributors) {
          setTopContributors(result.topContributors);
        }
      })().finally(() => setFetchingTopContributors(false));
    } catch (error) {
      console.warn(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeroSection
        landingHero
        title="Level Up Your Creativity – Download. Create. Explore."
      />

      {/* Trending tracks */}
      <MaxWidthWrapper>
        <Flex direction="column" py={12}>
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            w={"full"}
            my={3}
          >
            <h4>Trending tracks</h4>
            <Link to="/tracks">See more</Link>
          </Flex>
          <SwiperCardLayout>
            {isPending ? (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SwiperSlide key={i}>
                    <MusicCardSkeleton />
                  </SwiperSlide>
                ))}
              </>
            ) : (
              <>
                {audios.slice(0, 6).map((track) => (
                  <SwiperSlide key={track.id}>
                    <MusicCard key={track.id} track={track} type="Track" />
                  </SwiperSlide>
                ))}
              </>
            )}
          </SwiperCardLayout>
        </Flex>
      </MaxWidthWrapper>

      {/* Top 10 Contributers */}
      <Box py={8} w="full" backgroundColor={"#0A0A09"}>
        <MaxWidthWrapper>
          <Flex justifyContent={"space-between"} my={3}>
            <h4>Recent contributers</h4>
          </Flex>
          <SwiperCardLayout>
            {fetchingTopContributors ? (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SwiperSlide key={i}>
                    <ContributorCardSkeleton />
                  </SwiperSlide>
                ))}
              </>
            ) : (
              <>
                {topContributors?.map((contributor) => (
                  <SwiperSlide key={contributor.username}>
                    <GenreArtistCard
                      image={
                        (contributor.profilePath as string)
                          ? import.meta.env.VITE_AWS_BUCKET_LINK +
                            contributor.profilePath
                          : `https://api.dicebear.com/9.x/initials/png?seed=${contributor.firstName} ${contributor.lastName}`
                      }
                      path={`/profile/${contributor.username}`}
                      bg="#0A0A09"
                      imageRadius="full"
                      isOpacityEffect={true}
                      boxSize="150px"
                      name={
                        contributor.artistStageName ??
                        `${contributor.firstName} ${contributor.lastName}`
                      }
                    />
                  </SwiperSlide>
                ))}
              </>
            )}
          </SwiperCardLayout>
        </MaxWidthWrapper>
      </Box>

      {/* Popular Genre */}
      <MaxWidthWrapper>
        <Box py={12}>
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            w="full"
            my={3}
          >
            <h4>Popular Genres</h4>
            <Link to="/tracks" className="mr-3 hover:underline">
              See more
            </Link>
          </Flex>

          <SwiperCardLayout>
            {genreFetching ? (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SwiperSlide key={i}>
                    <GenreCardSkeleton />
                  </SwiperSlide>
                ))}
              </>
            ) : (
              <>
                {genres?.slice(0, 6).map((object, key) => (
                  <SwiperSlide key={key}>
                    <GenreArtistCard
                      key={key}
                      image={
                        import.meta.env.VITE_AWS_BUCKET_LINK +
                        object.genreArtwork
                      }
                      name={object.name}
                      path={`/tracks/?genre=${object.id}`}
                      bg="#141414"
                      imageRadius="md"
                      boxSize="200"
                    />
                  </SwiperSlide>
                ))}
              </>
            )}
          </SwiperCardLayout>
        </Box>
      </MaxWidthWrapper>

      {/* Compose Now */}
      <Box
        py={12}
        bgGradient={"to-r"}
        gradientFrom={"blue.900"}
        gradientTo={"purple.950"}
      >
        <MaxWidthWrapper>
          <Flex
            direction={{ base: "column", md: "row" }}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={10}
          >
            <Image
              src="/images/c.png"
              h={"400px"}
              w={"clamp(400px, 100%, 40vw)"}
              objectFit={"cover"}
              rounded={"xl"}
            />

            <Flex
              direction={"column"}
              gap={2}
              alignItems={{ base: "center", md: "start" }}
              textAlign={{ base: "center", md: "start" }}
            >
              <h3>Compose Your Success Story Now!</h3>
              <h4>Start Your Journey as a beat producer in kontraa</h4>
              <LinkButton href="/contributor" backgroundColor={"blue.500"}>
                Get started
              </LinkButton>
            </Flex>
          </Flex>
        </MaxWidthWrapper>
      </Box>

      {/* Compatible with */}
      <Box py={5} backgroundColor={"#0a0a09"}>
        <MaxWidthWrapper>
          <Flex direction="column" gap={4} alignItems={"start"}>
            <h4>Compatible with:</h4>
            <Marquee autoFill>
              {compatibleList.map((object, key) => (
                <Image src={object.image} key={key} boxSize={"90px"} mx={16} />
              ))}
            </Marquee>
          </Flex>
        </MaxWidthWrapper>
      </Box>

      {/* Newsletter */}
      <MaxWidthWrapper>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          py={14}
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          <Box>
            <h4>Newsletter</h4>
            <p>
              Subscibe to Kontraa's newsletter - your shortcut to music shorts.
            </p>
          </Box>

          <Flex direction="column" gap={4}>
            <h4>Your email address</h4>
            <PublicSearchInput
              logo={<Mail size="24" />}
              placeholder="Enter Your Email"
              button="submit"
              color="white"
              py={3}
              radius="md"
            />
            <Button backgroundColor={"gray.900"} color={"white"}>
              Subscribe to the newsletter
            </Button>
          </Flex>
        </Flex>
      </MaxWidthWrapper>
    </>
  );
}
