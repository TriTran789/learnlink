import { getResultTotalApi } from "@/apis/exam";
import { DataTable } from "@/components/DataTable";
import Loading from "@/components/Loading";
import ContentLayout from "@/layouts/ContentLayout";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "react-router-dom";

const ResultTotalPage = () => {
  const { examId } = useParams<{ examId: string }>();

  const { data, isPending } = useQuery({
    queryKey: ["resultTotal", examId],
    queryFn: () => getResultTotalApi(examId as string),
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <ContentLayout>
      <DataTable
        data={data || []}
        columns={
          [
            {
              accessorKey: "name",
              header: "Name",
              cell: (info) => info.getValue(),
            },
            {
              accessorKey: "phone",
              header: "Phone",
              cell: (info) => info.getValue(),
            },
            {
              accessorKey: "score",
              header: "Score",
              cell: (info) => info.getValue(),
            },
            {
              accessorKey: "status",
              header: "Status",
              cell: (info) => info.getValue(),
            },
            {
              accessorKey: "warning",
              header: "Warning Count",
              cell: (info) => info.getValue(),
            },
          ] as ColumnDef<{
            name: string;
            phone: string;
            score: number;
            status: string;
            warning: number;
          }>[]
        }
        keyFilter="name"
      />
    </ContentLayout>
  );
};

export default ResultTotalPage;
