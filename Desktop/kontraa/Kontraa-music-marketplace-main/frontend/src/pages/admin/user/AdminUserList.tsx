import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import {
  fetchUsers,
  updateUserActiveStatus,
} from "@/features/admin/adminSlice";
import { Button } from "@/components/ui/button";
import ListViewWrapper from "@/wrappers/ListViewWrapper";
import CustomTable from "@/components/global/CustomTable";
import CustomDialog from "@/components/global/CustomDialog";
import { useAppDispatch, useAppSelector } from "@/app/store";

export default function AdminUserList() {
  const dispatch = useAppDispatch();
  const { users, isPending } = useAppSelector((state) => state.admins);

  const [finalUsers, setFinalUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      setFinalUsers(users);
      return;
    }
    setFinalUsers(
      users.filter(
        (c) =>
          c.username.includes(e.target.value) ||
          c.email.includes(e.target.value)
      )
    );
  };

  const handleUpadteUserActiveStatus = async (id: number, active: boolean) => {
    await dispatch(updateUserActiveStatus({ id, active }))
      .unwrap()
      .then((p) => {
        setFinalUsers((prev) =>
          prev.map((c) => {
            if (c.id === p.updateUserActiveStatus.id) {
              return p.updateUserActiveStatus;
            }
            return c;
          })
        );
      });
  };

  const columns = useMemo<ColumnDef<User>[]>(
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
                title="Activate the user"
                bodyText="Are you sure you want to activate this user?"
                cancelText="Cancel"
                confirmText="Yes, Activate"
                handleConfirm={() =>
                  handleUpadteUserActiveStatus(row.original.id, true)
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
                handleUpadteUserActiveStatus(row.original.id, false)
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

  useEffect(() => {
    dispatch(fetchUsers(1))
      .unwrap()
      .then((p) => {
        setFinalUsers(p.users);
      });
  }, [dispatch]);

  return (
    <ListViewWrapper
      title="Users"
      hasAdd={false}
      subtitle="Activate or deactivate users"
      isLoading={isPending && finalUsers.length <= 0}
      isEmpty={finalUsers.length <= 0}
      hasSearch
      searchPlaceholder="Search using username or email"
      searchValue={searchText}
      onSearch={handleSearch}
    >
      <CustomTable columns={columns} data={finalUsers} />
    </ListViewWrapper>
  );
}
