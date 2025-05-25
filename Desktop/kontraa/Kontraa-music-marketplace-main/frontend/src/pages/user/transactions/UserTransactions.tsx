// import { useAppSelector } from "@/app/store";
import CustomTable from "@/components/global/CustomTable";
import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

export default function UserTransactions() {
  // const dispatch = useAppDispatch();
  // const { users } = useAppSelector((state) => state.admins);

  const [finalUsers] = useState<User[]>([]);

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
    ],
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    // dispatch(fetchUsers(1))
    //   .unwrap()
    //   .then((p) => {
    //     setFinalUsers(p.users);
    //   });
  }, []);

  return (
    <ListViewWrapper
      title="Transactions"
      hasAdd={false}
      subtitle="Your transactions"
      isLoading={false}
      isEmpty={false}
      hasSearch={false}
    >
      <CustomTable columns={columns} data={finalUsers} />
    </ListViewWrapper>
  );
}
