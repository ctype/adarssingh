import { useState } from "react";
import { Flag } from "lucide-react";
import { VStack } from "@chakra-ui/react";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toaster } from "../ui/toaster";
import { useAppDispatch } from "@/app/store";
import CustomInput from "../form/CustomInput";
import { Radio, RadioGroup } from "../ui/radio";
import { createReport } from "@/features/report/reportSlice";

interface IReportButtonProps {
  title: string;
  entityId: number;
  entityName: string;
  artistId: number;
}

export default function ReportButton({
  title,
  entityId,
  entityName,
  artistId,
}: IReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const remarkText = formData.get("remarkText") as string;

    const toSendRemark = remark === "Others" ? remarkText : remark;

    await dispatch(
      createReport({
        data: {
          remark: toSendRemark,
          entityId,
          entityName,
          status: "pending",
          artistId,
        },
      })
    )
      .unwrap()
      .then(() => {
        toaster.create({
          title: "Report has been sent",
          type: "success",
        });
        setOpen(false);
      });
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      placement={"center"}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          color={"white"}
          backgroundColor="gray.800"
          p={2}
          rounded={"full"}
        >
          <Flag size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle as="h4">{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit}>
            <VStack alignItems={"end"}>
              <RadioGroup
                name="remark"
                w="full"
                value={remark}
                onValueChange={(d) => setRemark(d.value)}
              >
                <VStack gap={4} alignItems={"start"}>
                  <Radio value="Explicit Content">Explicit Content</Radio>
                  <Radio value="Copyright strike">Copyright Strike</Radio>
                  {/* <Radio value="Explicit Content">Explicit Content</Radio> */}
                  <Radio value="Others">Others</Radio>
                </VStack>
              </RadioGroup>
              <CustomInput
                type={remark === "Others" ? "text" : "hidden"}
                name="remarkText"
                label={remark === "Others" ? "Please, Specify the reason" : ""}
              />
              <Button type="submit" colorPalette={"red"} mt={4}>
                Report
              </Button>
            </VStack>
          </form>
        </DialogBody>
        <DialogCloseTrigger
          color={"white"}
          _hover={{ backgroundColor: "transparent" }}
        />
      </DialogContent>
    </DialogRoot>
  );
}
