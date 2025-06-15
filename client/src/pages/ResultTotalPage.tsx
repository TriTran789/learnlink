import { getResultTotalApi } from "@/apis/exam";
import Loading from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const ResultTotalPage = () => {
  const { examId } = useParams<{ examId: string }>();

  const {data, isPending} = useQuery({
    queryKey: ["resultTotal", examId],
    queryFn: () => getResultTotalApi(examId as string),
  })

  console.log(data);

  if (isPending) {
    return <Loading />;
  }
  
  return <div>examId: {examId}</div>;
};

export default ResultTotalPage;
