import { getExamDetailApi } from "@/apis/exam";
import { deleteQuestionApi } from "@/apis/question";
import CreateQuestionForm from "@/components/CreateQuestionForm";
import Loading from "@/components/Loading";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ContentLayout from "@/layouts/ContentLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const ExamDetailPage = () => {
  const { classId, examId } = useParams();

  const {
    data: exam,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["exam", classId, examId],
    queryFn: () => getExamDetailApi(examId as string),
    enabled: !!classId && !!examId,
  });

  const { mutateAsync: deleteQuestion } = useMutation({
    mutationFn: deleteQuestionApi,
    onSuccess: () => {
      refetch();
      toast.success("Delete question successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <ContentLayout title={exam?.name} className="h-screen">
      {exam?.startAt && new Date() < new Date(exam.startAt) && (
        <>
          <div className="w-full flex justify-end">
            <CreateQuestionForm examId={examId as string} refetch={refetch} />
          </div>
          {exam?.questions.map((question, index) => (
            <div className="mt-4 rounded-2xl py-4 px-8">
              <div className="flex justify-between items-center">
                <p>
                  <span className="font-semibold">Question {index + 1}:</span>{" "}
                  {question.content}
                </p>
                <X
                  className="cursor-pointer hover:opacity-60"
                  onClick={() => {
                    deleteQuestion(question.id);
                  }}
                />
              </div>
              <RadioGroup
                className="mt-2"
                defaultValue={
                  question.answers.find((answer) => answer.isCorrect)?.id
                }
                disabled
              >
                {question.answers.map((answer) => (
                  <div className="flex gap-4">
                    <RadioGroupItem
                      value={answer.id}
                      className="border-2 border-gray-500 rounded-full w-5 h-5 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    />
                    <Label>{answer.content}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </>
      )}
      {exam?.startAt &&
        exam?.endAt &&
        new Date() > new Date(exam.startAt) &&
        new Date() < new Date(exam.endAt) && <p>The test is in progress.</p>}
    </ContentLayout>
  );
};

export default ExamDetailPage;
