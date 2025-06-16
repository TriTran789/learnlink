import { teacherGetClassDetailApi } from "@/apis/class";
import { DataTable } from "@/components/DataTable";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import PATH from "@/constants/PATH";
import ContentLayout from "@/layouts/ContentLayout";
import { decodeAccesstoken } from "@/lib/utils";
import { Exam, Lesson, Student } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const ClassDetailForTeacherPage = () => {
  const { profileId } = decodeAccesstoken();
  const { classId } = useParams<{ classId: string }>();
  const [page, setPage] = useState<"lessons" | "exams" | "students">("lessons");

  const { data, isPending } = useQuery({
    queryKey: ["class_details", classId],
    enabled: !!classId,
    queryFn: () =>
      teacherGetClassDetailApi({
        teacherId: profileId,
        classId: classId as string,
      }),
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <ContentLayout title={`${data?.name}`}>
      <div className="flex gap-4 border-b mb-4">
        <Button variant="ghost" onClick={() => setPage("lessons")}>
          Lessons
        </Button>
        <Button variant="ghost" onClick={() => setPage("exams")}>
          Exams
        </Button>
        <Button variant="ghost" onClick={() => setPage("students")}>
          Students
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
      {page === "students" && (
        <DataTable
          columns={
            [
              {
                accessorKey: "fullName",
                header: "Name",
              },
              {
                id: "avatar",
                header: "Avatar",
                cell: ({ row }) => {
                  const student = row.original as Student;
                  return (
                    <img
                      src={student.imageUrl}
                      alt={student.fullName}
                      className="h-32"
                    />
                  );
                },
              },
            ] as ColumnDef<Student>[]
          }
          data={data?.students || []}
          hiddenSearch
        />
      )}
      {page === "exams" && (
        <DataTable
          keyFilter="name"
          data={data?.exams || []}
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
                  return (
                    <>
                      {new Date(exam.endAt) > new Date() ? (
                        <p>Exam is ongoing.</p>
                      ) : (
                        <Link to={`${PATH.RESULT_TOTAL}/${exam.id}`}>
                          <Button variant="ghost">
                            View Result
                            <ArrowRight />
                          </Button>
                        </Link>
                      )}
                    </>
                  );
                },
              },
            ] as ColumnDef<Exam>[]
          }
        />
      )}
    </ContentLayout>
  );
};

export default ClassDetailForTeacherPage;
