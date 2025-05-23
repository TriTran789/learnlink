import { getExamsApi } from "@/apis/exam";
import CreateExamForm from "@/components/CreateExamForm";
import { DataTable } from "@/components/DataTable";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import PATH from "@/constants/PATH";
import { Exam } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  classId: string;
};

const ExamPageForClass = ({ classId }: Props) => {
  const { data: exams, isPending, refetch } = useQuery({
    queryKey: ["exams", classId],
    queryFn: () => getExamsApi(classId),
    enabled: !!classId,
  });

  if (isPending) {
    return <Loading />;
  }

  const columns: ColumnDef<Exam>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => row.getValue("duration"),
    },
    {
      accessorKey: "startAt",
      header: "Start At",
      cell: ({ row }) => new Date(row.getValue("startAt")).toLocaleString(),
    },
    {
      accessorKey: "endAt",
      header: "End At",
      cell: ({ row }) => new Date(row.getValue("endAt")).toLocaleString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const exam = row.original;
        return (
          <Link to={`${PATH.CLASSES}/${classId}/exam/${exam.id}`}>
            <Button variant="ghost">
              Details
              <ArrowRight />
            </Button>
          </Link>
        );
      },
    },
  ];

  return (
    <DataTable
      data={exams || []}
      columns={columns}
      button={<CreateExamForm classId={classId} refetch={refetch} />}
      keyFilter="name"
    />
  );
};

export default ExamPageForClass;
