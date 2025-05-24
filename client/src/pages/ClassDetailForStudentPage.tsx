import { studentGetClassDetailApi } from "@/apis/class";
import { DataTable } from "@/components/DataTable";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import PATH from "@/constants/PATH";
import ContentLayout from "@/layouts/ContentLayout";
import { Exam, Lesson } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const ClassDetailForStudentPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const [page, setPage] = useState<"lessons" | "exams">("lessons");

  const { data, isPending } = useQuery({
    queryKey: ["class_details", classId],
    enabled: !!classId,
    queryFn: () => studentGetClassDetailApi(classId as string),
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <ContentLayout title={`${data?.name} - ${data?.subject.name}`}>
      <div className="flex gap-4 border-b mb-4">
        <Button variant="ghost" onClick={() => setPage("lessons")}>
          Lessons
        </Button>
        <Button variant="ghost" onClick={() => setPage("exams")}>
          Exams
        </Button>
      </div>
      {page === "lessons" && (
        <div>
          <DataTable
            columns={
              [
                {
                  accessorKey: "name",
                  header: "Name",
                },
                {
                  accessorKey: "startAt",
                  header: "Start At",
                  cell: ({ row }) => {
                    const date = new Date(row.getValue("startAt"));
                    return date.toLocaleString();
                  },
                },
                {
                  accessorKey: "endAt",
                  header: "End At",
                  cell: ({ row }) => {
                    const date = new Date(row.getValue("endAt"));
                    return date.toLocaleString();
                  },
                },
                {
                  id: "action",
                  header: "Action",
                  cell: ({ row }) => {
                    const lesson = row.original as Lesson;
                    return (
                      <Link
                        to={`${PATH.CLASS_TECHER}/${classId}/lesson/${lesson.id}`}
                      >
                        <Button variant="ghost">
                          <ArrowRight />
                        </Button>
                      </Link>
                    );
                  },
                },
              ] as ColumnDef<Lesson>[]
            }
            data={data?.lessons || []}
            hiddenSearch
          />
        </div>
      )}
      {page === "exams" && (
        <div>
          <DataTable
            columns={
              [
                {
                  accessorKey: "name",
                  header: "Name",
                },
                {
                  accessorKey: "startAt",
                  header: "Start At",
                  cell: ({ row }) => {
                    const date = new Date(row.getValue("startAt"));
                    return date.toLocaleString();
                  },
                },
                {
                  accessorKey: "endAt",
                  header: "End At",
                  cell: ({ row }) => {
                    const date = new Date(row.getValue("endAt"));
                    return date.toLocaleString();
                  },
                },
                {
                  id: "action",
                  header: "Action",
                  cell: ({ row }) => {
                    const exam = row.original as Exam;

                    if (new Date() < new Date(exam.startAt)) {
                      return <span>Not started</span>;
                    }

                    if (new Date() > new Date(exam.endAt)) {
                      return (
                        <Button variant="ghost">
                          View results
                          <ArrowRight />
                        </Button>
                      );
                    }

                    return (
                      <Button variant="ghost">
                        Go exam
                        <ArrowRight />
                      </Button>
                    );
                  },
                },
              ] as ColumnDef<Exam>[]
            }
            data={data?.exams || []}
            hiddenSearch
          />
        </div>
      )}
    </ContentLayout>
  );
};

export default ClassDetailForStudentPage;
