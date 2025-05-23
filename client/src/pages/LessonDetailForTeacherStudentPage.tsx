import { getLessonDetailApi } from "@/apis/lesson";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import PATH from "@/constants/PATH";
import ContentLayout from "@/layouts/ContentLayout";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

const LessonDetailForTeacherStudentPage = () => {
  const { lessonId } = useParams<{
    classId: string;
    lessonId: string;
  }>();

  const { data, isPending } = useQuery({
    queryKey: ["lessonDetail", lessonId],
    queryFn: () => getLessonDetailApi(lessonId as string),
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <ContentLayout title={data?.name}>
      <p>{data?.content}</p>
      <div className="mt-4">
        <p>
          {data?.startAt &&
            new Date() < new Date(data.startAt) &&
            "The class has not started yet"}
          {data?.startAt &&
            data?.endAt &&
            new Date() < new Date(data.endAt) &&
            new Date() > new Date(data.startAt) &&
            "The class is ongoing"}
          {data?.endAt &&
            new Date() > new Date(data.endAt) &&
            "The class has ended"}
        </p>
        {data?.startAt &&
          data?.endAt &&
          new Date() < new Date(data.endAt) &&
          new Date() > new Date(data.startAt) && (
            <Link to={`${PATH.CALL}/${data?.id}`}>
              <Button>Join Call</Button>
            </Link>
          )}
      </div>
    </ContentLayout>
  );
};

export default LessonDetailForTeacherStudentPage;
