import { useParams } from "react-router-dom";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useContext, useEffect, useRef } from "react";
import { Layers, Mic2, Radio, Video } from "lucide-react";
import {
  createListCollection,
  Flex,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";

import "@/styles/mkeditor.css";
import "@mdxeditor/editor/style.css";

import { useAppDispatch } from "@/app/store";
import { toaster } from "@/components/ui/toaster";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { LicenseTemplateContext } from "../context/LicenseTemplateContext";
import {
  createLicenseTemplate,
  updateLicenseTemplate,
} from "@/features/license/licenseTemplateSlice";
import { initialLicenseTemplate } from "../utils/licenseTemplateData";
import MDXEditorTextArea from "@/components/md/MDXEditorTextArea";

export default function LicenseTemplateContract({
  setCurrentStep,
}: {
  setCurrentStep: (value: number) => void;
}) {
  const { id } = useParams();
  const { licenseTemplate, setLicenseTemplate } = useContext(
    LicenseTemplateContext
  );
  const ref = useRef<MDXEditorMethods>(null);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const lt = Object.fromEntries(formData.entries());

    const data = {
      licenseTemplateText: ref?.current?.getMarkdown() || "",
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
      if (licenseTemplate)
        (async () => {
          if (id) {
            await dispatch(
              updateLicenseTemplate({
                id: Number(id),
                data: { ...licenseTemplate, ...data },
              })
            ).unwrap();
          } else {
            await dispatch(
              createLicenseTemplate({ ...licenseTemplate, ...data })
            ).unwrap();
          }
        })().then(() => {
          if (!id) {
            setLicenseTemplate(initialLicenseTemplate);
            setCurrentStep(0);
          }
          toaster.create({
            title: `Sucessfully ${id ? "edited the" : "created a"} license template`,
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
    if (id && licenseTemplate.licenseTemplateText) {
      ref.current?.setMarkdown(licenseTemplate.licenseTemplateText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [licenseTemplate.licenseTemplateText]);

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
          defaultValue={licenseTemplate?.audioLicenseDuration?.toString()}
          placeholder="Add the license duration (in years)"
          type="number"
        />

        <Flex direction={"column"} gap={4} alignItems={"start"}>
          <CustomInput
            name="audioLicenseDistribution"
            label="Number of distribution allowed"
            defaultValue={
              licenseTemplate?.audioLicenseDistribution === "unlimited"
                ? ""
                : licenseTemplate?.audioLicenseDistribution
            }
            placeholder="Add number of distribution allowed"
            type="number"
            disabled={licenseTemplate?.audioLicenseDistribution === "unlimited"}
          />
          <Checkbox
            defaultChecked={
              licenseTemplate?.audioLicenseDistribution === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicenseTemplate((prev) => ({
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
              licenseTemplate?.audioLicenseStreams === "unlimited"
                ? ""
                : licenseTemplate?.audioLicenseStreams
            }
            placeholder="Add number of audio streams allowed"
            disabled={licenseTemplate?.audioLicenseStreams === "unlimited"}
            type="number"
          />
          <Checkbox
            defaultChecked={
              licenseTemplate?.audioLicenseStreams === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicenseTemplate((prev) => ({
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
              licenseTemplate?.audioLicenseFreeDownloads === "unlimited"
                ? ""
                : licenseTemplate?.audioLicenseFreeDownloads
            }
            placeholder="Add number of free downloads allowed"
            type="number"
            disabled={
              licenseTemplate?.audioLicenseFreeDownloads === "unlimited"
            }
          />
          <Checkbox
            defaultChecked={
              licenseTemplate?.audioLicenseFreeDownloads === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicenseTemplate((prev) => ({
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
              licenseTemplate?.musicVideoMonitizedAmount === "unlimited"
                ? ""
                : licenseTemplate?.musicVideoMonitizedAmount
            }
            placeholder="Add number of monetized music videos allowed"
            type="number"
            disabled={
              licenseTemplate?.musicVideoMonitizedAmount === "unlimited"
            }
          />
          <Checkbox
            defaultChecked={
              licenseTemplate?.musicVideoMonitizedAmount === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicenseTemplate((prev) => ({
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
              licenseTemplate?.musicVideoNonMonitizedAmount === "unlimited"
                ? ""
                : licenseTemplate?.musicVideoNonMonitizedAmount
            }
            placeholder="Add number of non-monetized music videos allowed"
            type="number"
            disabled={
              licenseTemplate?.musicVideoNonMonitizedAmount === "unlimited"
            }
          />
          <Checkbox
            defaultChecked={
              licenseTemplate?.musicVideoNonMonitizedAmount === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicenseTemplate((prev) => ({
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
              licenseTemplate?.musicVideoMonitizedStreamAmount === "unlimited"
                ? ""
                : licenseTemplate?.musicVideoMonitizedStreamAmount
            }
            placeholder="Add number of monetized music video streams allowed"
            disabled={
              licenseTemplate?.musicVideoMonitizedStreamAmount === "unlimited"
            }
            type="number"
          />
          <Checkbox
            defaultChecked={
              licenseTemplate?.musicVideoMonitizedStreamAmount === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicenseTemplate((prev) => ({
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
              licenseTemplate?.musicVideoNonMonitizedStreamAmount ===
              "unlimited"
                ? ""
                : licenseTemplate?.musicVideoNonMonitizedStreamAmount
            }
            placeholder="Add number of non-monetized music video streams allowed"
            type="number"
            disabled={
              licenseTemplate?.musicVideoNonMonitizedStreamAmount ===
              "unlimited"
            }
          />
          <Checkbox
            defaultChecked={
              licenseTemplate?.musicVideoNonMonitizedStreamAmount ===
              "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicenseTemplate((prev) => ({
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
          defaultValue={
            licenseTemplate?.radioBroadcastRights ? "true" : "false"
          }
          options={createListCollection({
            items: [
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ],
          })}
          onChange={(v) => {
            setLicenseTemplate((prev) => ({
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
              licenseTemplate?.radioStationsAmount === "unlimited"
                ? ""
                : licenseTemplate?.radioStationsAmount
            }
            placeholder="Add number of radio stations allowed"
            type="number"
            disabled={licenseTemplate?.radioStationsAmount === "unlimited"}
          />
          <Checkbox
            defaultChecked={
              licenseTemplate?.radioStationsAmount === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicenseTemplate((prev) => ({
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
          defaultValue={
            licenseTemplate?.livePerformanceProfitRights ? "true" : "false"
          }
          options={createListCollection({
            items: [
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ],
          })}
          onChange={(v) => {
            setLicenseTemplate((prev) => ({
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
              licenseTemplate?.livePerformanceNonProfitAmount === "unlimited"
                ? ""
                : licenseTemplate?.livePerformanceNonProfitAmount
            }
            placeholder="Add number of non-profit live performance allowed"
            type="number"
            disabled={
              licenseTemplate?.livePerformanceNonProfitAmount === "unlimited"
            }
          />
          <Checkbox
            defaultChecked={
              licenseTemplate?.livePerformanceNonProfitAmount === "unlimited"
            }
            accentColor={"blue.500"}
            onCheckedChange={(v) => {
              setLicenseTemplate((prev) => ({
                ...prev,
                livePerformanceNonProfitAmount: v.checked ? "unlimited" : "",
              }));
            }}
          >
            Unlimited
          </Checkbox>
        </Flex>

        <GridItem colSpan={2}>
          <MDXEditorTextArea label="License Template" ref={ref} />
        </GridItem>
      </Grid>
    </form>
  );
}
