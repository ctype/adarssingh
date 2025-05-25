import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { Layers, Mic2, Radio, Video } from "lucide-react";
import {
  createListCollection,
  Flex,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";

import { useAppDispatch } from "@/app/store";
import { toaster } from "@/components/ui/toaster";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { initialLicenseData } from "../utils/licenseData";
import MDXEditorTextArea from "@/components/md/MDXEditorTextArea";
import { ContributorLicenseContext } from "../context/ContributorLicenseContext";
import { createLicense, updateLicense } from "@/features/license/licenseSlice";

export default function LicenseContract({
  setCurrentStep,
}: {
  setCurrentStep: (value: number) => void;
}) {
  const { id } = useParams();
  const { license, setLicense } = useContext(ContributorLicenseContext);
  const dispatch = useAppDispatch();
  const ref = useRef<MDXEditorMethods>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const lt = Object.fromEntries(formData.entries());

    const data = {
      licenseText: ref?.current?.getMarkdown() || "",
      audioLicenseDuration: Number(lt.audioLicenseDuration),
      audioLicenseDistribution: lt.audioLicenseDistribution
        ? (lt.audioLicenseDistribution as string)
        : "unlimited",
      audioLicenseStreams: lt.audioLicenseStreams
        ? (lt.audioLicenseStreams as string)
        : "unlimited",
      audioLicenseFreeDownloads: lt.audioLicenseFreeDownloads
        ? (lt.audioLicenseFreeDownloads as string)
        : "unlimited",
      musicVideoMonitizedAmount: lt.musicVideoMonitizedAmount
        ? (lt.musicVideoMonitizedAmount as string)
        : "unlimited",
      musicVideoNonMonitizedAmount: lt.musicVideoNonMonitizedAmount
        ? (lt.musicVideoNonMonitizedAmount as string)
        : "unlimited",
      musicVideoMonitizedStreamAmount: lt.musicVideoMonitizedStreamAmount
        ? (lt.musicVideoMonitizedStreamAmount as string)
        : "unlimited",
      musicVideoNonMonitizedStreamAmount: lt.musicVideoNonMonitizedStreamAmount
        ? (lt.musicVideoNonMonitizedStreamAmount as string)
        : "unlimited",
      radioBroadcastRights: (lt.radioBroadcastRights as string) === "true",
      radioStationsAmount: lt.radioStationsAmount
        ? (lt.radioStationsAmount as string)
        : "unlimited",
      livePerformanceProfitRights:
        (lt.livePerformanceProfitRights as string) === "true",
      livePerformanceNonProfitAmount: lt.livePerformanceNonProfitAmount
        ? (lt.livePerformanceNonProfitAmount as string)
        : "unlimited",
    };
    try {
      if (license)
        (async () => {
          if (id) {
            await dispatch(
              updateLicense({
                id: Number(id),
                data: { ...license, ...data },
              })
            ).unwrap();
          } else {
            await dispatch(createLicense({ ...license, ...data })).unwrap();
          }
        })().then(() => {
          if (!id) {
            setLicense(initialLicenseData);
            setCurrentStep(0);
          }
          toaster.create({
            title: `Sucessfully ${
              id ? "edited the" : "created a"
            } license template`,
            type: "success",
          });
        });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error while creating license template",
        type: "error",
      });
    }
  };

  useEffect(() => {
    ref.current?.setMarkdown(license?.licenseText);
  }, [license?.licenseText]);

  return (
    <form onSubmit={handleSubmit} id="license-template-contract-form">
      <Grid templateColumns={"repeat(2, 1fr)"} gap={4} px={2}>
        <GridItem colSpan={2} display={"flex"} alignItems={"center"} gap={2}>
          <Layers size={20} />
          <Text fontWeight={"bold"}>Distribution</Text>
        </GridItem>

        <CustomInput
          name="audioLicenseDuration"
          label="License Duration"
          defaultValue={license?.audioLicenseDuration?.toString()}
          placeholder="Add the license duration (in years)"
          type="number"
        />

        <Flex direction={"column"} gap={4} alignItems={"start"}>
          <CustomInput
            name="audioLicenseDistribution"
            label="Number of distribution allowed"
            defaultValue={
              license?.audioLicenseDistribution === "unlimited"
                ? ""
                : license?.audioLicenseDistribution
            }
            placeholder="Add number of distribution allowed"
            type="number"
            disabled={license?.audioLicenseDistribution === "unlimited"}
          />
          <Checkbox
            defaultChecked={license?.audioLicenseDistribution === "unlimited"}
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicense((prev) => ({
                ...prev,
                audioLicenseDistribution: v.checked ? "unlimited" : "",
              }));
            }}
          >
            Unlimited
          </Checkbox>
        </Flex>

        <Flex direction={"column"} gap={4} alignItems={"start"}>
          <CustomInput
            name="audioLicenseStreams"
            label="Number of audio streams allowed"
            defaultValue={
              license?.audioLicenseStreams === "unlimited"
                ? ""
                : license?.audioLicenseStreams
            }
            placeholder="Add number of audio streams allowed"
            disabled={license?.audioLicenseStreams === "unlimited"}
            type="number"
          />
          <Checkbox
            defaultChecked={license?.audioLicenseStreams === "unlimited"}
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicense((prev) => ({
                ...prev,
                audioLicenseStreams: v.checked ? "unlimited" : "",
              }));
            }}
          >
            Unlimited
          </Checkbox>
        </Flex>

        <Flex direction={"column"} gap={4} alignItems={"start"}>
          <CustomInput
            name="audioLicenseFreeDownloads"
            label="Number of free downloads allowed"
            defaultValue={
              license?.audioLicenseFreeDownloads === "unlimited"
                ? ""
                : license?.audioLicenseFreeDownloads
            }
            placeholder="Add number of free downloads allowed"
            type="number"
            disabled={license?.audioLicenseFreeDownloads === "unlimited"}
          />
          <Checkbox
            defaultChecked={license?.audioLicenseFreeDownloads === "unlimited"}
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicense((prev) => ({
                ...prev,
                audioLicenseFreeDownloads: v.checked ? "unlimited" : "",
              }));
            }}
          >
            Unlimited
          </Checkbox>
        </Flex>

        <GridItem
          colSpan={2}
          display={"flex"}
          alignItems={"center"}
          gap={2}
          mt={4}
        >
          <Video size={20} />
          <Text fontWeight={"bold"}>Music Videos</Text>
        </GridItem>

        <Flex direction={"column"} gap={4} alignItems={"start"}>
          <CustomInput
            name="musicVideoMonitizedAmount"
            label="Number of monetized music videos allowed"
            defaultValue={
              license?.musicVideoMonitizedAmount === "unlimited"
                ? ""
                : license?.musicVideoMonitizedAmount
            }
            placeholder="Add number of monetized music videos allowed"
            type="number"
            disabled={license?.musicVideoMonitizedAmount === "unlimited"}
          />
          <Checkbox
            defaultChecked={license?.musicVideoMonitizedAmount === "unlimited"}
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicense((prev) => ({
                ...prev,
                musicVideoMonitizedAmount: v.checked ? "unlimited" : "",
              }));
            }}
          >
            Unlimited
          </Checkbox>
        </Flex>

        <Flex direction={"column"} gap={4} alignItems={"start"}>
          <CustomInput
            name="musicVideoNonMonitizedAmount"
            label="Number of non-monetized music videos allowed"
            defaultValue={
              license?.musicVideoNonMonitizedAmount === "unlimited"
                ? ""
                : license?.musicVideoNonMonitizedAmount
            }
            placeholder="Add number of non-monetized music videos allowed"
            type="number"
            disabled={license?.musicVideoNonMonitizedAmount === "unlimited"}
          />
          <Checkbox
            defaultChecked={
              license?.musicVideoNonMonitizedAmount === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicense((prev) => ({
                ...prev,
                musicVideoNonMonitizedAmount: v.checked ? "unlimited" : "",
              }));
            }}
          >
            Unlimited
          </Checkbox>
        </Flex>

        <Flex direction={"column"} gap={4} alignItems={"start"}>
          <CustomInput
            name="musicVideoMonitizedStreamAmount"
            label="Number of monetized music video streams allowed"
            defaultValue={
              license?.musicVideoMonitizedStreamAmount === "unlimited"
                ? ""
                : license?.musicVideoMonitizedStreamAmount
            }
            placeholder="Add number of monetized music video streams allowed"
            disabled={license?.musicVideoMonitizedStreamAmount === "unlimited"}
            type="number"
          />
          <Checkbox
            defaultChecked={
              license?.musicVideoMonitizedStreamAmount === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicense((prev) => ({
                ...prev,
                musicVideoMonitizedStreamAmount: v.checked ? "unlimited" : "",
              }));
            }}
          >
            Unlimited
          </Checkbox>
        </Flex>

        <Flex direction={"column"} gap={4} alignItems={"start"}>
          <CustomInput
            name="musicVideoNonMonitizedStreamAmount"
            label="Number of non-monetized music video streams allowed"
            defaultValue={
              license?.musicVideoNonMonitizedStreamAmount === "unlimited"
                ? ""
                : license?.musicVideoNonMonitizedStreamAmount
            }
            placeholder="Add number of non-monetized music video streams allowed"
            type="number"
            disabled={
              license?.musicVideoNonMonitizedStreamAmount === "unlimited"
            }
          />
          <Checkbox
            defaultChecked={
              license?.musicVideoNonMonitizedStreamAmount === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicense((prev) => ({
                ...prev,
                musicVideoNonMonitizedStreamAmount: v.checked
                  ? "unlimited"
                  : "",
              }));
            }}
          >
            Unlimited
          </Checkbox>
        </Flex>

        <GridItem
          colSpan={2}
          display={"flex"}
          alignItems={"center"}
          gap={2}
          mt={4}
        >
          <Radio size={20} />
          <Text fontWeight={"bold"}>Radio Broadcasting</Text>
        </GridItem>

        <CustomSelect
          name={"radioBroadcastRights"}
          label={"Radio Broadcast Rights"}
          defaultValue={license?.radioBroadcastRights ? "true" : "false"}
          options={createListCollection({
            items: [
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ],
          })}
          onChange={(v) => {
            setLicense((prev) => ({
              ...prev,
              radioBroadcastRights: v === "true",
            }));
          }}
        />

        <Flex direction={"column"} gap={4} alignItems={"start"}>
          <CustomInput
            name="radioStationsAmount"
            label="Number of radio stations allowed"
            defaultValue={
              license?.radioStationsAmount === "unlimited"
                ? ""
                : license?.radioStationsAmount
            }
            placeholder="Add number of radio stations allowed"
            type="number"
            disabled={license?.radioStationsAmount === "unlimited"}
          />
          <Checkbox
            defaultChecked={license?.radioStationsAmount === "unlimited"}
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicense((prev) => ({
                ...prev,
                radioStationsAmount: v.checked ? "unlimited" : "",
              }));
            }}
          >
            Unlimited
          </Checkbox>
        </Flex>

        <GridItem
          colSpan={2}
          display={"flex"}
          alignItems={"center"}
          gap={2}
          mt={4}
        >
          <Mic2 size={20} />
          <Text fontWeight={"bold"}>Live Performance</Text>
        </GridItem>

        <CustomSelect
          name={"livePerformanceProfitRights"}
          label={"Live Performance Profit Rights"}
          defaultValue={license?.livePerformanceProfitRights ? "true" : "false"}
          options={createListCollection({
            items: [
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ],
          })}
          onChange={(v) => {
            setLicense((prev) => ({
              ...prev,
              livePerformanceProfitRights: v === "true",
            }));
          }}
        />

        <Flex direction={"column"} gap={4} alignItems={"start"}>
          <CustomInput
            name="livePerformanceNonProfitAmount"
            label="Number of non-profit live performance allowed"
            defaultValue={
              license?.livePerformanceNonProfitAmount === "unlimited"
                ? ""
                : license?.livePerformanceNonProfitAmount
            }
            placeholder="Add number of non-profit live performance allowed"
            type="number"
            disabled={license?.livePerformanceNonProfitAmount === "unlimited"}
          />
          <Checkbox
            defaultChecked={
              license?.livePerformanceNonProfitAmount === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicense((prev) => ({
                ...prev,
                livePerformanceNonProfitAmount: v.checked ? "unlimited" : "",
              }));
            }}
          >
            Unlimited
          </Checkbox>
        </Flex>

        <GridItem colSpan={2}>
          <MDXEditorTextArea label={"License"} ref={ref} />
        </GridItem>
      </Grid>
    </form>
  );
}
