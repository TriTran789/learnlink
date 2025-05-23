import { getClassDetailApi } from "@/apis/class";
import Loading from "@/components/Loading";
import StudentPageForClass from "@/pages/StudentPageForClass";
import { Button } from "@/components/ui/button";
import ContentLayout from "@/layouts/ContentLayout";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import LessonPageForClass from "./LessonPageForClass";
import ExamPageForClass from "@/pages/ExamPageForClass";

const ClassDetailPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const [page, setPage] = useState<"lessons" | "exams" | "students">("lessons");

  const { data, isPending } = useQuery({
    queryKey: ["class_details", classId],
    enabled: !!classId,
    queryFn: () => getClassDetailApi(classId as string),
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <ContentLayout
      title={`${data?.name} (${data?.subject_name} - ${data?.teaccher_name})`}
    >
      <div className="flex gap-4 border-b">
        <Button variant="ghost" onClick={() => setPage("lessons")}>
          Lessons
        </Button>
        <Button variant="ghost" onClick={() => setPage("exams")}>
          Exams
        </Button>
        <Button variant="ghost" onClick={() => setPage("students")}>
          Student
        </Button>
      </div>
      {page === "lessons" && <LessonPageForClass classId={classId as string} />}
      {page === "exams" && <ExamPageForClass classId={classId as string} />}
      {page === "students" && (
        <StudentPageForClass classId={classId as string} />
      )}
    </ContentLayout>
  );
};

export default ClassDetailPage;
