import { getLessonsApi } from "@/apis/lesson";
import CreateLessonForm from "@/components/CreateLessonForm";
import { DataTable } from "@/components/DataTable";
import Loading from "@/components/Loading";
import { Lesson } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";

type Props = {
  classId: string;
};

const LessonPageForClass = ({ classId }: Props) => {
  const {
    data: lessons,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["lessons", classId],
    queryFn: () => getLessonsApi(classId),
  });

  if (isPending) {
    return <Loading />;
  }

  const columns: ColumnDef<Lesson>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "startAt",
      header: "Start Time",
      cell: ({ row }) => {
        const startAt = new Date(row.original.startAt);
        return startAt.toLocaleString();
      },
    },
    {
      accessorKey: "endAt",
      header: "End Time",
      cell: ({ row }) => {
        const endAt = new Date(row.original.endAt);
        return endAt.toLocaleString();
      },
    },
    // {
    //   id: "action",
    //   header: "Action",
    //   cell: ({ row }) => {
    //     const lesson = row.original;

    //     return (
    //       <Button variant="ghost">
    //         Details
    //         <ArrowRight />
    //       </Button>
    //     );
    //   },
    // },
  ];

  return (
    <DataTable
      columns={columns}
      data={lessons || []}
      button={<CreateLessonForm classId={classId} refetch={refetch} />}
      keyFilter="name"
    />
  );
};

export default LessonPageForClass;
