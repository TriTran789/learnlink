import { getLessonDetailApi, getRecordApi } from "@/apis/lesson";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import PATH from "@/constants/PATH";
import ContentLayout from "@/layouts/ContentLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
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

  const {
    mutate,
    isPending: pendingGetRecord,
    data: records,
  } = useMutation({
    mutationFn: getRecordApi,
  });

  useEffect(() => {
    if (data?.endAt && new Date() > new Date(data.endAt)) {
      mutate(lessonId as string);
    }
  }, [data?.endAt]);

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
          {data?.endAt && new Date() > new Date(data.endAt) && (
            <div className="flex flex-col gap-4">
              <p>The class has ended</p>
              <div className="flex flex-col gap-4">
                {pendingGetRecord ? (
                  <Loading />
                ) : (
                  <div>
                    {records?.map((record) => (
                      <video src={record.url} controls />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
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
