import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Image,
} from "@chakra-ui/react";

import { Field } from "../ui/field";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
  FileUploadFileChangeDetails,
} from "../ui/file-upload";

const ACCEPT_TYPES = {
  image: ["image/png", "image/jpeg", "image/avif", "image/webp"],
  video: ["video/mp4"],
  "audio-wav": [
    "audio/wav",
    "audio/x-wav",
    "audio/wave",
    "audio/x-pn-wav"
  ],
  "audio-mp3": ["audio/mpeg"],
  zip: [
    "application/x-zip-compressed",
    "application/zip",
    "application/x-rar",
  ],
};

const ACCEPT_TYPE_STRING = {
  image: "Image",
  video: "Mp4",
  "audio-wav": "WAV",
  "audio-mp3": "Mp3",
  zip: "Zip and rar",
};

interface ICustomFileInputProps {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: {
    name: string;
    url: string;
  };
  error?: string | null;
  accept?: (keyof typeof ACCEPT_TYPES)[];
  onChange?: (details: FileUploadFileChangeDetails) => void;
  isUploading?: boolean;
  maxSize?: number; // in MB
}

export default function CustomFileInput(props: ICustomFileInputProps) {
  const {
    name,
    label,
    required = true,
    error = null,
    defaultValue,
    accept = ["image"],
    onChange,
    isUploading,
    maxSize = 5,
  } = props;

  const [fileChanged, setFileChanged] = useState<boolean>(false);
  const [hasDefault, setHasDefault] = useState<boolean>(false);
  const [sizeError, setSizeError] = useState<boolean>(false);

  const handleFileChange = (details: FileUploadFileChangeDetails) => {
    if (details.acceptedFiles.length <= 0) {
      return;
    }

    const file = details.acceptedFiles[0];
    const MAX_SIZE_BYTES = maxSize * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      setSizeError(true);
      return;
    } else {
      setSizeError(false);
    }

    if (onChange) {
      onChange(details);
    }
  };

  useEffect(() => {
    if (defaultValue && !fileChanged) {
      setHasDefault(true);
    }
  }, [defaultValue, fileChanged]);

  return (
    <Field
      invalid={!!error || sizeError}
      label={label}
      required={required && (!hasDefault || fileChanged)}
      errorText={error || (sizeError && "The file size is too big")}
    >
      <FileUploadRoot
        maxFiles={1}
        alignItems={"stretch"}
        name={name}
        accept={accept.map((a) => ACCEPT_TYPES[a]).flat()}
        disabled={isUploading}
        onFileChange={handleFileChange}
        onChange={() => {
          setFileChanged(true);
        }}
        width={"300px"}
        position={"relative"}
      >
        <FileUploadDropzone
          label={
            isUploading
              ? "Your file is uploading, please wait..."
              : "Drag and drop here to upload"
          }
          description={
            !isUploading &&
            `${accept
              .map((a) => ACCEPT_TYPE_STRING[a])
              .join(", ")} file up to ${maxSize}MB`
          }
          backgroundColor={isUploading ? "orange.400/30" : "transparent"}
          borderColor={isUploading ? "orange.400" : "gray.600"}
          onDrop={() => {
            setFileChanged(true);
          }}
          _focus={{ outlineColor: "blue.500" }}
        />

        {hasDefault && defaultValue && !fileChanged ? (
          <Flex
            gap={2}
            alignItems={"center"}
            p={2}
            bg={"gray.800"}
            rounded={"md"}
            position="absolute"
          >
            {accept.includes("image") && (
              <Image
                src={defaultValue.url}
                alt={defaultValue.name}
                width={"100px"}
              />
            )}
            <p>{defaultValue.name}</p>
          </Flex>
        ) : (
          <Box position="absolute" left={0} right={0} bottom={0}>
            <FileUploadList clearable />
          </Box>
        )}
      </FileUploadRoot>
    </Field>
  );
}
