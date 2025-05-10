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
import { X } from "lucide-react";
import { toast } from "sonner";

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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (!image) {
      toast.error("Image is required");
      return;
    }
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("image", image);
    console.log(formData);
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStudentForm;
