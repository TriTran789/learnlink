import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "./ui/file-upload";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { convertToBase64 } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { createStudentApi } from "@/apis/student";

const formSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().nonempty("Phone number is required"),
});

const CreateStudentForm = () => {
  const [image, setImage] = useState<File | null>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const { mutateAsync: createStudent, isPending: pendingCreateStudent } =
    useMutation({
      mutationFn: createStudentApi,
      onSuccess: () => {
        toast.success("Student created successfully");
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (!image) {
      toast.error("Image is required");
      return;
    }
    const base64 = await convertToBase64(image);
    // console.log({ ...values, image: base64 });
    await createStudent({ ...values, image: base64 });
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl bg-black text-white">
        <DialogHeader>
          <DialogTitle>Create New Student</DialogTitle>
          <DialogDescription>Enter new student information.</DialogDescription>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
            {image ? (
              <div className="flex items-center justify-center w-full flex-col">
                <div className="w-full flex justify-end">
                  <X
                    className="cursor-pointer"
                    onClick={() => setImage(null)}
                  />
                </div>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Uploaded"
                  className="h-48 object-cover rounded"
                />
              </div>
            ) : (
              <FileUpload onChange={(files: File[]) => setImage(files[0])} />
            )}
            <Button type="submit">
              {pendingCreateStudent ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStudentForm;
