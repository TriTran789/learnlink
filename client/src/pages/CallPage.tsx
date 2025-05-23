import { getCallApi } from "@/apis/lesson";
import CallComponent from "@/components/CallComponent";
import Loading from "@/components/Loading";
import { decodeAccesstoken } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const CallPage = () => {
  const { id } = decodeAccesstoken();
  const { lessonId } = useParams<{ lessonId: string }>();

  const { data, isPending } = useQuery({
    queryKey: ["call", lessonId],
    queryFn: () => getCallApi({ userId: id, lessonId: lessonId! }),
  });

  if (isPending) {
    return <Loading />;
  }

  return <CallComponent data={data!} />;
};

export default CallPage;


