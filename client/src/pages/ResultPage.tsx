import { useParams } from "react-router-dom";

const ResultPage = () => {
  const { examId } = useParams<{ examId: string }>();

  return <div>ResultPage: {examId}</div>;
};

export default ResultPage;
