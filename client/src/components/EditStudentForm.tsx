import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { PayloadUpdateStudent, Student } from "@/types";
import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { FileUpload } from "./ui/file-upload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { editStudentApi } from "@/apis/student";
import { convertToBase64 } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  phone: z.string().nonempty("Phone number is required"),
});

type Props = {
  refetch: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  student: Student | null;
};

const EditStudentForm = ({ refetch, open, setOpen, student }: Props) => {
  const [image, setImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
    },
  });

  const { mutateAsync: editStudent, isPending } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: PayloadUpdateStudent;
    }) => editStudentApi(id, payload),
    onSuccess: () => {
      toast.success("Student updated successfully");
      form.reset();
      refetch();
      setOpen(false);
      setImage(null);
      setNewImage(null);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    // Set the default values when the student prop changes
    if (student) {
      form.reset({
        fullName: student.fullName,
        phone: student.phone,
      });
      setImage(student.imageUrl);
    }
  }, [student]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await editStudent({
      id: student?.id || "",
      payload: {
        ...values,
        newImage: newImage ? await convertToBase64(newImage) : undefined,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black text-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {image && (
              <div className="flex items-center justify-center w-full flex-col">
                <div className="w-full flex justify-end">
                  <X
                    className="cursor-pointer"
                    onClick={() => setImage(null)}
                  />
                </div>
                <img
                  src={image}
                  alt="Uploaded"
                  className="h-48 object-cover rounded"
                />
              </div>
            )}
            {newImage && (
              <div className="flex items-center justify-center w-full flex-col">
                <div className="w-full flex justify-end">
                  <X
                    className="cursor-pointer"
                    onClick={() => setNewImage(null)}
                  />
                </div>
                <img
                  src={URL.createObjectURL(newImage)}
                  alt="Uploaded"
                  className="h-48 object-cover rounded"
                />
              </div>
            )}
            {!image && !newImage && (
              <FileUpload onChange={(files: File[]) => setNewImage(files[0])} />
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentForm;
