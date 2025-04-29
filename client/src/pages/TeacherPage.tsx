import CreateTeacherForm from "@/components/CreateTeacherForm";
import { DataTable } from "@/components/DataTable";
import ContentLayout from "@/layouts/ContentLayout";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const TeacherPage = () => {
  const {} = useQuery({
    queryKey: ["teachers"],
  });
  
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
  ];

  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ];

  return (
    <ContentLayout title="Teachers">
      <DataTable columns={columns} data={data} button={<CreateTeacherForm />} />
    </ContentLayout>
  );
};

export default TeacherPage;
