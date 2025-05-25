import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Separator,
  Text,
} from "@chakra-ui/react";
import {
  Activity,
  Filter,
  Headphones,
  LanguagesIcon,
  // Music,
  Music2,
  Music3,
  Smile,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/store";
import CustomInput from "@/components/form/CustomInput";
import CustomAccordion from "@/components/global/CustomAccordion";
import HeroSection from "@/components/landing/HeroSection";
import TagSelectionSection from "@/components/music/TagSelectionSection";
// import { Radio, RadioGroup } from "@/components/ui/radio";
import { fetchGenres } from "@/features/genre/genreSlice";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import { fetchSubGenres } from "@/features/subGenre/subGenreSlice";
import { fetchMoodTypes } from "@/features/moodType/moodTypeSlice";
import { fetchKeys } from "@/features/key/keySlice";
import { fetchLanguages } from "@/features/language/languageSlice";
import { fetchAudios } from "@/features/audio/audioSlice";
import MusicCard from "@/components/music/MusicCard";
import MusicCardSkeleton from "@/components/loader/MusicCardSkeleton";
import NoDataComponent from "@/components/global/NoDataComponent";
import CustomCheckbox from "@/components/form/CustomCheckbox";
import CustomDefaultDrawer from "@/components/global/CustomDefaultDrawer";
import { Button } from "@/components/ui/button";
import { useWindowResize } from "@/hooks/useWindowResize";

export default function MusicExplorePage() {
  const navigate = useNavigate();
  const query = useSearchParams();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { isNavbarOpen, setIsNavbarOpen } = useWindowResize({ size: 768 });

  const [filter, setFilter] = useState<IAudioFilterOptions>({
    sortBy: "createdAt",
    order: 1,
    limit: 40,
    offset: 0,
    search: null,
    genre: null,
    subGenre: null,
    instrumentId: null,
    audioKey: null,
    moodType: null,
    language: null,
    endBpm: null,
    startBpm: null,
    tags: null,
  });

  const getAudios = useCallback(
    async (filter: IAudioFilterOptions) => {
      dispatch(
        fetchAudios({ filter: { ...filter, status: 1, isDraft: false } })
      ).unwrap();
    },
    [dispatch]
  );

  const handleFilterUpdate = (
    name: keyof IAudioFilterOptions,
    value: string | boolean | number | null,
    isArray: boolean = false
  ) => {
    if (isArray) {
      const data = filter[name];
      if (data) {
        if ((data as number[]).includes(Number(value))) {
          const newFilterValues = (filter[name] as number[]).filter(
            (v) => v !== Number(value)
          );
          setFilter((prev) => ({
            ...prev,
            [name]: newFilterValues.length <= 0 ? null : newFilterValues,
          }));
        } else {
          setFilter((prev) => ({
            ...prev,
            [name]: [...(prev[name] as number[]), Number(value)],
          }));
        }
      } else {
        setFilter((prev) => ({
          ...prev,
          [name]: [Number(value)],
        }));
      }
    } else {
      setFilter((prev) => ({ ...prev, [name]: value }));
    }

    let q = query[0].toString();
    if (pathname.split("")[pathname.split("").length - 1] === "/") {
      q = `?${q}`;
    } else {
      q = `/?${q}`;
    }

    if (value) {
      if (!isArray) {
        q += `&${name}=${value}`;
      } else {
        if (query[0].has(name, value!.toString())) {
          q = q.replace(`&${name}=${value}`, "");
        } else {
          q += `&${name}=${value}`;
        }
      }
    } else {
      const v = query[0].get(name);
      q = q.replace(`&${name}=${v}`, "");
    }

    navigate(`${pathname}${q}`, { replace: true });
  };

  useEffect(() => {
    const qrr = query[0];
    const filterKeys = Object.keys(filter);

    if (qrr.size <= 0) {
      return;
    }

    const f: dynamicObj = {};

    for (let i = 0; i < filterKeys.length; i++) {
      const name = filterKeys[i] as keyof IAudioFilterOptions;
      const values = qrr.getAll(name);
      if (values.length > 0) {
        if (
          [
            "genre",
            "subGenre",
            "instrumentId",
            "audioKey",
            "moodType",
            "language",
          ].includes(name)
        ) {
          f[name] = values.map((v) => +v);
        } else {
          if (
            ["startBpm", "order", "endBpm", "offset", "limit"].includes(name)
          ) {
            f[name] = Number(qrr.get(name));
          } else {
            f[name] = qrr.get(name);
          }
        }
      }
      if (!qrr.get(name)) {
        f[name] = filter[name];
      }
    }
    setFilter(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isNavbarOpen) {
      getAudios(filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, getAudios]);

  return (
    <Box>
      <HeroSection landingHero={false} title="Search for music to listen" />

      <MaxWidthWrapper>
        <Box py={10} minH="100vh">
          <TagSelectionSection
            title="Explore Music"
            tags={[]}
            selectedTag={0}
            defaultSort={filter.sortBy ?? "latest"}
            onSortChange={(sort) =>
              setFilter((prev) => ({
                ...prev,
                sortBy: sort === "latest" ? "createdAt" : "title",
                order: sort === "alphaReverse" ? -1 : 1,
              }))
            }
          />
          <Flex direction={{ base: "column", md: "row" }} gap={4} mt={8}>
            <Box display={{ base: "none", md: "block" }}>
              <FilterCard filter={filter} handleFilter={handleFilterUpdate} />
            </Box>
            <Box
              display={{ base: "block", md: "none" }}
              position={"fixed"}
              bottom={12}
              left={"40%"}
              translateX={"-50%"}
              zIndex={"docked"}
            >
              <CustomDefaultDrawer
                open={isNavbarOpen}
                setOpen={setIsNavbarOpen}
                trigger={
                  <Button
                    colorPalette={"white"}
                    rounded={"full"}
                    size={"md"}
                    onClick={() => setIsNavbarOpen(true)}
                  >
                    <Filter /> Filters
                  </Button>
                }
              >
                <FilterCard
                  filter={filter}
                  handleFilter={handleFilterUpdate}
                  handleFilterActivate={() => {
                    setIsNavbarOpen(false);
                    getAudios(filter);
                  }}
                />
              </CustomDefaultDrawer>
            </Box>
            <MusicGrid />
          </Flex>
        </Box>
      </MaxWidthWrapper>
    </Box>
  );
}

interface IFilterCardProps {
  filter: IAudioFilterOptions;
  handleFilter: (
    name: keyof IAudioFilterOptions,
    value: string | number | boolean | null,
    isArray?: boolean
  ) => void;
  handleFilterActivate?: () => void;
}

function FilterCard({
  filter,
  handleFilter,
  handleFilterActivate,
}: IFilterCardProps) {
  const dispatch = useAppDispatch();
  const genreData = useAppSelector((state) => state.genres.genres);
  const subGenreData = useAppSelector((state) => state.subGenres.subGenres);
  // const soundTrackDataArr = useAppSelector(
  //   (state) => state.sound.soundTrackData
  // );
  const moodTypeData = useAppSelector((state) => state.moodTypes.moodTypes);
  const keyData = useAppSelector((state) => state.keys.keys);
  const languageData = useAppSelector((state) => state.languages.languages);

  const filters = [
    {
      title: <FilterTitleCard title="Genre" icon={<Headphones size={20} />} />,
      content: (
        <Flex gap={4} flexWrap={"wrap"}>
          {genreData.map((genre) => (
            <CustomCheckbox
              key={genre.id}
              isChecked={filter.genre?.includes(genre.id) ?? false}
              handleCheck={() => {
                handleFilter("genre", genre.id, true);
              }}
              checkboxName={genre.name}
            />
          ))}
        </Flex>
      ),
      value: "genre",
    },
    {
      title: <FilterTitleCard title="Sub Genre" icon={<Music2 size={20} />} />,
      content: (
        <Flex gap={4} flexWrap={"wrap"}>
          {subGenreData.map((subGenre) => (
            <CustomCheckbox
              key={subGenre.id}
              isChecked={filter.subGenre?.includes(subGenre.id) ?? false}
              handleCheck={() => {
                handleFilter("subGenre", subGenre.id, true);
              }}
              checkboxName={subGenre.name}
            />
          ))}
        </Flex>
      ),
      value: "subGenre",
    },
    {
      title: <FilterTitleCard title="BPM" icon={<Activity size={20} />} />,
      content: (
        <HStack gap={4} width={"inherit"}>
          <CustomInput
            label=""
            name="bpmLow"
            type="number"
            placeholder="0"
            value={filter.startBpm ?? undefined}
            onChange={(e) => {
              handleFilter(
                "startBpm",
                e.target.value !== "" ? Number(e.target.value) : null
              );
            }}
          />
          <p>to</p>
          <CustomInput
            label=""
            name="bpmHigh"
            type="number"
            placeholder="300"
            value={filter.endBpm ?? undefined}
            onChange={(e) => {
              handleFilter(
                "endBpm",
                e.target.value !== "" ? Number(e.target.value) : null
              );
            }}
          />
        </HStack>
      ),
      value: "bpm",
    },
    {
      title: <FilterTitleCard title="Mood Type" icon={<Smile size={20} />} />,
      content: (
        <Flex gap={4} flexWrap={"wrap"}>
          {moodTypeData.map((moodType) => (
            <CustomCheckbox
              key={moodType.id}
              isChecked={filter.moodType?.includes(moodType.id) ?? false}
              handleCheck={() => {
                handleFilter("moodType", moodType.id, true);
              }}
              checkboxName={moodType.name}
            />
          ))}
        </Flex>
      ),
      value: "moodType",
    },
    // {
    //   title: <FilterTitleCard title="Sound Track" icon={<Music size={20} />} />,
    //   content: (
    //     <RadioGroup display={"flex"} gap={4} flexWrap={"wrap"}>
    //       {genreData.map((genre) => (
    //         <Radio value={genre.id.toString()} key={genre.id}>
    //           {genre.name}
    //         </Radio>
    //       ))}
    //     </RadioGroup>
    //   ),
    //   value: "soundTrack",
    // },
    {
      title: <FilterTitleCard title="Key" icon={<Music3 size={20} />} />,
      content: (
        <Flex gap={4} flexWrap={"wrap"}>
          {keyData.map((audioKey) => (
            <CustomCheckbox
              key={audioKey.id}
              isChecked={filter.audioKey?.includes(audioKey.id) ?? false}
              handleCheck={() => {
                handleFilter("audioKey", audioKey.id, true);
              }}
              checkboxName={audioKey.name}
            />
          ))}
        </Flex>
      ),
      value: "audioKey",
    },
    {
      title: (
        <FilterTitleCard title="Language" icon={<LanguagesIcon size={20} />} />
      ),
      content: (
        <Flex gap={4} flexWrap={"wrap"}>
          {languageData.map((language) => (
            <CustomCheckbox
              key={language.id}
              isChecked={filter.language?.includes(language.id) ?? false}
              handleCheck={() => {
                handleFilter("language", language.id, true);
              }}
              checkboxName={language.name}
            />
          ))}
        </Flex>
      ),
      value: "languages",
    },
  ];

  useEffect(() => {
    (async () => {
      await dispatch(fetchGenres()).unwrap();
      await dispatch(fetchSubGenres()).unwrap();
      await dispatch(fetchMoodTypes()).unwrap();
      await dispatch(fetchKeys()).unwrap();
      await dispatch(fetchLanguages()).unwrap();
    })();
  }, [dispatch]);

  return (
    <Flex
      maxWidth={"20vw"}
      minWidth={"max(15vw, 350px)"}
      direction="column"
      backgroundColor={{ base: "initial", md: "gray.900" }}
      py={2}
      px={4}
      rounded={"md"}
      position={{ base: "relative", md: "sticky" }}
      top={{ base: 0, md: 75 }}
      maxH={{ base: "95vh", md: "85vh" }}
      overflowY={"scroll"}
    >
      <Box py={4}>
        <h5>FILTERS</h5>
      </Box>
      <Separator borderColor={"gray.700"} my={2} />
      <CustomAccordion items={filters} selectedDefaultValue="genre" />
      <Button
        display={{ base: "block", md: "none" }}
        colorPalette={"blue"}
        onClick={handleFilterActivate}
      >
        see filter result
      </Button>
    </Flex>
  );
}

const FilterTitleCard = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => {
  return (
    <Flex gap={2} alignItems={"center"} py={4}>
      {icon}
      <Text>{title}</Text>
    </Flex>
  );
};

// interface IMusicGridProps {
//   filter: IAudioFilterOptions;
// }

const MusicGrid = () => {
  const { audios, isPending } = useAppSelector((state) => state.audios);
  // const filteredAudios = audios.filter((a) => {
  //   return (
  //     (filter.genre?.includes((a.genre as Genre).id) ||
  //       filter.genre === null) &&
  //     (filter.subGenre?.includes((a.subGenre as SubGenre).id) ||
  //       filter.subGenre === null) &&
  //     (filter.audioKey?.includes((a.audioKey as Key).id) ||
  //       filter.audioKey === null) &&
  //     (filter.instrumentId?.includes((a.instrumentId as Instrument).id) ||
  //       filter.instrumentId === null) &&
  //     (filter.language?.includes((a.language as Language).id) ||
  //       filter.language === null) &&
  //     (filter.moodType?.includes((a.moodType as MoodType).id) ||
  //       filter.moodType === null) &&
  //     (!filter.startBpm || a.audioBpm! > filter.startBpm) &&
  //     (!filter.endBpm || a.audioBpm! < filter.endBpm) &&
  //     (filter.search === null || a.title.includes(filter.search!))
  //   );
  // });

  return (
    <Grid
      templateColumns={{
        base: "repeat(2, 1fr)",
        smToMd: "repeat(3, 1fr)",
        md: "repeat(1, 1fr)",
        lg: "repeat(2, 1fr)",
        xl: "repeat(4, 1fr)",
      }}
      gap={2}
      w={"full"}
      h={"full"}
    >
      {isPending ? (
        <>
          {Array.from({ length: 15 }).map((_, i) => (
            <MusicCardSkeleton key={i} />
          ))}
        </>
      ) : audios.length <= 0 ? (
        <GridItem colSpan={5}>
          <NoDataComponent noFoundText="No Music found for the given filters" />
        </GridItem>
      ) : (
        <>
          {audios.map((audio) => (
            <MusicCard key={audio.id} track={audio} type="Track" />
          ))}
        </>
      )}
    </Grid>
  );
};
