import { Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useDownload } from "@/hooks/useDownload";
import ListViewWrapper from "@/wrappers/ListViewWrapper";
import CustomTable from "@/components/global/CustomTable";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchMyDownloads } from "@/features/downloads/downloadActivitySlice";

export default function UserDownloads() {
  const dispatch = useAppDispatch();
  const { downloads } = useAppSelector((state) => state.downloads);
  const { handleDownload, handleLicenseDownload } = useDownload();

  const [finalDownloads, setFinalDownloads] = useState<UserDownload[]>([]);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      setFinalDownloads(downloads);
      return;
    }
    setFinalDownloads(
      downloads.filter(
        (c) =>
          c.fileName.includes(e.target.value) ||
          c.artistName.includes(e.target.value)
      )
    );
  };

  const columns = useMemo<ColumnDef<UserDownload>[]>(
    () => [
      {
        accessorKey: "fileName",
        cell: (info) => info.getValue(),
        header: "File",
        //this column will sort in ascending order by default since it is a string column
      },
      {
        accessorFn: (row) => row.entityName,
        id: "entityName",
        cell: (info) => info.getValue(),
        header: "Type of resource",
        sortUndefined: "last", //force undefined values to the end
        sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
      },
      {
        accessorKey: "fileKey",
        header: "Download",
        cell: ({ row, getValue }) => {
          return (
            <Button
              size="xs"
              colorPalette={"green"}
              onClick={() =>
                handleDownload(
                  getValue() as string,
                  row.original.fileName,
                  row.original.fileType as FileType,
                  row.original.type as DownloadType,
                  row.original.entityName,
                  row.original.entityId,
                  row.original.licenseId
                )
              }
            >
              Download File
            </Button>
          );
        },
      },
      {
        accessorKey: "licenseId",
        header: "License",
        cell: ({ row, getValue }) => {
          return (
            <>
              {getValue() ? (
                <Button
                  size="xs"
                  colorPalette={"blue"}
                  onClick={() =>
                    handleLicenseDownload(
                      getValue() as number,
                      row.original.fileType as FileType
                    )
                  }
                >
                  Download License
                </Button>
              ) : (
                <Text>No license</Text>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "artistName",
        header: () => "Artist",
        cell: ({ getValue }) => {
          return (
            <Text textDecoration={"underline"} color="blue.400">
              <Link to={`/profile/${getValue()}`}>{getValue() as string}</Link>
            </Text>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Downloaded",
        sortUndefined: "last",
        cell: ({ getValue }) => {
          return formatDistanceToNow(getValue() as string) + " ago";
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    dispatch(fetchMyDownloads())
      .unwrap()
      .then((p) => {
        setFinalDownloads(p.myDownloads);
      });
  }, [dispatch]);

  return (
    <ListViewWrapper
      title="Downloads"
      hasAdd={false}
      subtitle="Resources you have downloaded from kontraa"
      isLoading={false}
      isEmpty={false}
      hasSearch
      searchPlaceholder="Search using track or artist name"
      searchValue={searchText}
      onSearch={handleSearch}
    >
      <CustomTable columns={columns} data={finalDownloads} />
    </ListViewWrapper>
  );
}
