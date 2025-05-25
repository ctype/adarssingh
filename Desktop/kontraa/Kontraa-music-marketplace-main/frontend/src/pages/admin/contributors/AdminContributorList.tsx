import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Box, Flex, Tabs, Text } from "@chakra-ui/react";

import {
  acceptRejectContributorRequest,
  fetchContributors,
  fetchUsers,
  updateUserActiveStatus,
} from "@/features/admin/adminSlice";
import { Button } from "@/components/ui/button";
import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppDispatch, useAppSelector } from "@/app/store";
import CustomDialog from "@/components/global/CustomDialog";
import CustomDataDialog from "@/components/global/CustomNoActionDialog";
import CustomTable from "@/components/global/CustomTable";
import CustomInput from "@/components/form/CustomInput";
import { FormDialog } from "@/components/form/FormDialog";

export default function AdminContributorList() {
  const dispatch = useAppDispatch();
  const { contributors, isPending, users } = useAppSelector(
    (state) => state.admins
  );

  const [finalContributors, setFinalContributors] = useState<Contributor[]>([]);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [reason, setReason] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      setFinalContributors(contributors);
      return;
    }
    setFinalContributors(
      contributors.filter(
        (c) =>
          c.username.includes(e.target.value) ||
          c.email.includes(e.target.value)
      )
    );
  };

  const handleUpadteContributorActiveStatus = async (
    id: number,
    active: boolean
  ) => {
    await dispatch(updateUserActiveStatus({ id, active }))
      .unwrap()
      .then((p) => {
        setFinalContributors((prev) =>
          prev.map((c) => {
            if (c.id === p.updateUserActiveStatus.id) {
              return p.updateUserActiveStatus;
            }
            return c;
          })
        );
      });
  };

  const handleAcceptRejectContributorRequest = async (
    id: number,
    status: boolean,
    rejectData: string[]
  ) => {
    await dispatch(acceptRejectContributorRequest({ id, status, rejectData }))
      .unwrap()
      .then(() => {
        setReason("");
        setOpen(false);
        setId(null);
      });
  };

  const contributorCols = useMemo<ColumnDef<Contributor>[]>(
    () => [
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
        header: "First Name",
        //this column will sort in ascending order by default since it is a string column
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: "Last Name",
        sortUndefined: "last", //force undefined values to the end
        sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
      },
      {
        accessorKey: "username",
        header: () => "User Name",
        //this column will sort in descending order by default since it is a number column
      },
      {
        accessorKey: "email",
        header: "Email",
        sortUndefined: "last", //force undefined values to the end
      },
      {
        accessorKey: "deactiveStatus",
        header: "Action",
        cell: ({ getValue, row }) => {
          if (getValue()) {
            return (
              <CustomDialog
                title="Activate the Contributor"
                bodyText="Are you sure you want to activate this user?"
                cancelText="Cancel"
                confirmText="Yes, Activate"
                handleConfirm={() =>
                  handleUpadteContributorActiveStatus(row.original.id, true)
                }
              >
                <Button backgroundColor={"green.600"} color={"white"}>
                  Activate
                </Button>
              </CustomDialog>
            );
          }
          return (
            <CustomDialog
              title="Deactivate the user"
              bodyText="Are you sure you want to deactivate the user?"
              cancelText="Cancel"
              confirmText="Yes, Deactivate"
              handleConfirm={() =>
                handleUpadteContributorActiveStatus(row.original.id, false)
              }
            >
              <Button backgroundColor={"red.600"} color={"white"}>
                Deactivate
              </Button>
            </CustomDialog>
          );
        },
        enableSorting: false,
      },
    ],
    // eslint-disable-next-line
    []
  );

  const contributorRequestCols = useMemo<ColumnDef<Contributor>[]>(
    () => [
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
        header: "First Name",
        //this column will sort in ascending order by default since it is a string column
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: "Last Name",
        sortUndefined: "last", //force undefined values to the end
        sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
      },
      {
        accessorKey: "username",
        header: () => "User Name",
        //this column will sort in descending order by default since it is a number column
      },
      {
        accessorKey: "email",
        header: "Email",
        sortUndefined: "last", //force undefined values to the end
      },
      {
        header: "Action",
        cell: ({ row }) => {
          const contributor = row.original;
          return (
            <Flex gap={2} alignItems={"center"}>
              <CustomDataDialog
                triggerText="View Details"
                dialogTitle="User Details"
              >
                <Flex direction={"column"} gap={2}>
                  <p>Email: {contributor.professionalEmail}</p>
                  <p>Phone Number: {contributor.mobileNumber}</p>
                  <p>Bio: {contributor.biography}</p>
                  <p>Artist Name / Username: {contributor.artistStageName}</p>
                  <p>Country: {contributor.country}</p>
                  <p>Content Types: {contributor.contentType}</p>
                  <p>Genre Types: {contributor.genreType}</p>
                  <p>Experience Level: {contributor.experienceLevel}</p>
                  <p>Portfilio Link: {contributor.portfolioLink}</p>
                </Flex>
              </CustomDataDialog>
              <CustomDialog
                title="Accept the request"
                bodyText="Are you sure you want to accept this user account to be converted as contributor?"
                cancelText="Cancel"
                confirmText="Yes, Accept"
                handleConfirm={() =>
                  handleAcceptRejectContributorRequest(contributor.id, true, [])
                }
              >
                <Button backgroundColor={"green.600"} color={"white"}>
                  Accept
                </Button>
              </CustomDialog>
              <Button
                backgroundColor={"red.600"}
                color={"white"}
                onClick={() => {
                  setId(contributor.id);
                  setOpen(true);
                }}
              >
                Reject
              </Button>
            </Flex>
          );
        },
        enableSorting: false,
      },
    ],
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    dispatch(fetchContributors(1))
      .unwrap()
      .then((p) => {
        setFinalContributors(p.contributors);
      });
    dispatch(fetchUsers(1)).unwrap();
  }, [dispatch]);

  return (
    <ListViewWrapper
      title="Contributors"
      hasAdd={false}
      subtitle="Activate or deactivate contributors"
      isLoading={
        isPending && finalContributors.length <= 0 && users.length <= 0
      }
      isEmpty={finalContributors.length <= 0 && users.length <= 0}
      hasSearch
      searchPlaceholder="Search using username or email"
      searchValue={searchText}
      onSearch={handleSearch}
    >
      <Tabs.Root defaultValue={"old-contributors"} variant="enclosed">
        <Tabs.List backgroundColor={"gray.900"} border={"none"}>
          <Tabs.Trigger
            color={"gray.400"}
            backgroundColor={"transparent"}
            _selected={{ color: "white", backgroundColor: "gray.800" }}
            value={"old-contributors"}
          >
            Contributors
          </Tabs.Trigger>
          <Tabs.Trigger
            color={"gray.400"}
            backgroundColor={"transparent"}
            _selected={{ color: "white", backgroundColor: "gray.800" }}
            value={"request-contributors"}
          >
            New request{" "}
            <Text fontWeight={"semibold"} color={"blue.500"}>
              {users.filter((u) => u.professionalEmail).length > 0 &&
                `( ${users.filter((u) => u.professionalEmail).length} )`}
            </Text>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value={"old-contributors"}>
          <Box>
            <CustomTable columns={contributorCols} data={finalContributors} />
          </Box>
        </Tabs.Content>
        <Tabs.Content value={"request-contributors"}>
          <Box>
            <CustomTable
              columns={contributorRequestCols}
              data={users
                .filter((u) => u.professionalEmail)
                .map((u) => u as unknown as Contributor)}
            />
          </Box>
        </Tabs.Content>
      </Tabs.Root>
      <FormDialog
        title="Reject the request"
        open={open}
        setOpen={setOpen}
        handleSubmit={() => {
          if (id) {
            handleAcceptRejectContributorRequest(id, false, [reason]);
          }
        }}
        handleCancel={() => {
          setId(null);
          setOpen(false);
        }}
        yesText="Yes, Reject"
        yesBgColor="red.800"
        isNotForm
      >
        <CustomInput
          label="Reason for rejection"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </FormDialog>
    </ListViewWrapper>
  );
}
