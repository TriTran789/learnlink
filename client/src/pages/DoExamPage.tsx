import { CheckFaceApi } from "@/apis/auth";
import { getExamToDoApi, submitExamApi } from "@/apis/exam";
import Loading from "@/components/Loading";
import PATH from "@/constants/PATH";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const DoExamPage = () => {
  const navigate = useNavigate();

  const { examId } = useParams<{ examId: string }>();

  const [timer, setTimer] = useState<number>(3600);

  const fullscreenRef = useRef<HTMLDivElement>(null);
  const hasLoggedSubmit = useRef(false); // Track if submit has been logged
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<number>(0); // Track warning count

  const form = useForm();

  const { data: exam, isPending: pendingGetExam } = useQuery({
    queryKey: ["exam_details", examId],
    enabled: !!examId,
    queryFn: () => getExamToDoApi(examId as string),
  });

  const { mutateAsync: submitExam, isPending: pendingSubmitExam } = useMutation(
    {
      mutationFn: submitExamApi,
      onSuccess: () => {
        navigate(`${PATH.RESULT}/${examId}`);
      },
      onError: (error) => {
        navigate(PATH.ERROR_EXAM);
        toast(error.message);
      },
    }
  );

  const { mutate } = useMutation({
    mutationFn: CheckFaceApi,
    onError: async () => {
      if (warningRef.current >= 5) {
        await submitExam({
          examId: examId || "",
          warning: warningRef.current,
          data: form.getValues() as any,
        });
      }
      warningRef.current += 1; // Tăng số lần cảnh báo
    },
  });

  const onSubmit = async (data: any) => {
    if (hasLoggedSubmit.current === true) {
      return;
    }
    hasLoggedSubmit.current = true; // Set flag to true to prevent multiple submissions
    await submitExam({
      examId: examId || "",
      warning: warningRef.current,
      data,
    });
  };

  // Chụp ảnh và chuyển thành base64
  const captureImage = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        mutate(imageData); // Gọi hàm mutate với ảnh đã chụp
      }
    }
  };

  useEffect(() => {
    // Hàm để mở camera
    const openCamera = async () => {
      try {
        // Yêu cầu quyền truy cập camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Lưu stream vào streamRef
        streamRef.current = stream;

        // Gán stream vào video
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error opening camera:", error);
      }
    };

    openCamera();

    if (fullscreenRef.current) {
      try {
        fullscreenRef.current.requestFullscreen();
      } catch (error) {
        console.error("Error requesting fullscreen:", error);
      }
    }

    const handleFullscreenChange = async () => {
      if (!document.fullscreenElement && !hasLoggedSubmit.current) {
        hasLoggedSubmit.current = true; // Set flag to true after logging
        await submitExam({
          examId: examId || "",
          warning: warningRef.current,
          data: form.getValues() as any,
        });
      }
    };

    const handleWindowBlur = async () => {
      if (!hasLoggedSubmit.current) {
        hasLoggedSubmit.current = true;
        await submitExam({
          examId: examId || "",
          warning: warningRef.current,
          data: form.getValues() as any,
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("blur", handleWindowBlur);

    // Thiết lập interval để gửi ảnh từ camera mỗi 5 giây
    intervalRef.current = setInterval(captureImage, 5000);

    return () => {
      warningRef.current = 0; // Reset warning count on unmount
      clearInterval(intervalRef.current!); // Dọn dẹp interval khi component unmount

      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("blur", handleWindowBlur);
      hasLoggedSubmit.current = false; // Reset flag on unmount

      // Cleanup: Tắt camera khi component unmount
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        streamRef.current = null; // Reset streamRef
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Reset video source
      }
    };
  }, []);

  useEffect(() => {
    setTimer((exam?.duration || 60) * 60); // Set timer to exam duration in seconds
  }, [exam]);

  useEffect(() => {
    if (timer <= 0) {
      submitExam({
        examId: examId || "",
        warning: warningRef.current,
        data: form.getValues() as any,
      });
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <div ref={fullscreenRef} className="overflow-y-auto">
      <div className="fixed sm:w-xs w-[180px] top-4 right-4">
        <video ref={videoRef} autoPlay playsInline className="scale-x-[-1]" />
        <div className="bg-black text-center text-lg font-semibold text-red-500">
          Warning: {warningRef.current}/5
        </div>
        <div className="bg-black text-center text-lg font-semibold text-white">
          {Math.floor(timer / 60)
            .toString()
            .padStart(2, "0")}
          :{(timer % 60).toString().padStart(2, "0")}
        </div>
      </div>
      {pendingGetExam || pendingSubmitExam ? (
        <Loading />
      ) : (
        <div className="p-8 max-sm:pt-56">
          <h1 className="text-2xl font-bold mb-4">{exam?.name}</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              {exam?.questions.map((question, index) => (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={`questions.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        {index + 1}. {question.content}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          {...field}
                          onValueChange={field.onChange}
                          className="space-y-2"
                        >
                          {question.answers.map((answer) => (
                            <FormItem key={answer.id} className="flex">
                              <FormControl>
                                <RadioGroupItem
                                  value={answer.id}
                                  id={`question-${question.id}-answer-${answer.id}`}
                                  className="border-2 border-gray-500 rounded-full w-5 h-5 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor={`question-${question.id}-answer-${answer.id}`}
                              >
                                {answer.content}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default DoExamPage;
