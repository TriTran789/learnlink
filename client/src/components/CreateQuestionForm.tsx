import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createQuestionApi } from "@/apis/question";

const formSchema = z.object({
  content: z.string().nonempty("Content is required"),
  a: z.string().nonempty("Option A is required"),
  b: z.string().nonempty("Option B is required"),
  c: z.string().nonempty("Option C is required"),
  d: z.string().nonempty("Option D is required"),
  answer: z.enum(["a", "b", "c", "d"], {
    errorMap: () => ({ message: "Answer is required" }),
  }),
});

type Props = {
  examId: string;
  refetch: () => void;
};

const CreateQuestionForm = ({ examId, refetch }: Props) => {
  const [open, setOpen] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      a: "",
      b: "",
      c: "",
      d: "",
      answer: "a",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createQuestionApi,
    onSuccess: () => {
      refetch();
      toast.success("Add question successfully");
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await mutateAsync({
      examId,
      ...values,
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Add Question</Button>
      </DialogTrigger>
      <DialogContent className="bg-black text-white">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter question" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="a"
              render={({ field }) => (
                <FormItem className="flex gap-4">
                  <FormLabel>A</FormLabel>
                  <FormControl>
                    <Input placeholder="Option A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="b"
              render={({ field }) => (
                <FormItem className="flex gap-4">
                  <FormLabel>B</FormLabel>
                  <FormControl>
                    <Input placeholder="Option B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="c"
              render={({ field }) => (
                <FormItem className="flex gap-4">
                  <FormLabel>C</FormLabel>
                  <FormControl>
                    <Input placeholder="Option C" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="d"
              render={({ field }) => (
                <FormItem className="flex gap-4">
                  <FormLabel>D</FormLabel>
                  <FormControl>
                    <Input placeholder="Option D" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem className="space-y-3 flex items-center gap-8">
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-y-1 items-center"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="a"
                            className="border-2 border-gray-500 rounded-full w-5 h-5 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">A</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="b"
                            className="border-2 border-gray-500 rounded-full w-5 h-5 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">B</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="c"
                            className="border-2 border-gray-500 rounded-full w-5 h-5 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">C</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="d"
                            className="border-2 border-gray-500 rounded-full w-5 h-5 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">D</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionForm;
