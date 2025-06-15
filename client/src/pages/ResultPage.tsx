import { getExamResultApi } from "@/apis/exam";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PATH from "@/constants/PATH";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const ResultPage = () => {
  const { examId } = useParams<{ examId: string }>();

  const { data, isPending, isError } = useQuery({
    queryKey: ["examResult", examId],
    queryFn: () => getExamResultApi(examId as string),
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="w-full overflow-auto">
      {isError ? (
        <div className="h-full flex flex-col gap-4 items-center justify-center">
          <p>Exam is ongoing. Please waiting the exam end to watch resrult.</p>
          <Link to={PATH.DASHBOARD}>
            <Button>
              <ArrowLeft />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      ) : (
        <div className="w-full p-8">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold">{data.examName}</p>
            <p className="text-2xl font-bold">Score: {data.score}</p>
          </div>
          {data.questions.map((question, index) => (
            <div className="mt-4 rounded-2xl py-4 px-8">
              <div className="flex justify-between items-center">
                <p>
                  <span className="font-semibold">Question {index + 1}:</span>{" "}
                  {question.content}
                </p>
              </div>
              <RadioGroup
                className="mt-2"
                defaultValue={
                  question.answers.find((answer) => answer.checked)?.id
                }
                disabled
              >
                {question.answers.map((answer) => (
                  <div className="flex gap-4">
                    <RadioGroupItem
                      value={answer.id}
                      className={
                        answer.isCorrect && answer.checked
                          ? "border-2 border-gray-500 rounded-full w-5 h-5 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          : "border-2 border-gray-500 rounded-full w-5 h-5 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white hover:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      }
                    />
                    <Label>
                      {answer.content}
                      {answer.isCorrect && !answer.checked && <Check className="mr-4 text-blue-500" />}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultPage;
