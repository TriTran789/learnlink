import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Teacher } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateTeacherApi } from "@/apis/teacher";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  level: z.string().nonempty("Level is required"),
  phone: z.string().nonempty("Phone number is required"),
});

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  teacher: Teacher | null;
  refetch: Function;
};

const EditTeacherForm = ({ open, setOpen, teacher, refetch }: Props) => {
  const { mutateAsync: updateTeacher, isPending } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { fullName: string; phone: string; level: string };
    }) => updateTeacherApi(id, payload),
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: teacher?.fullName || "",
      level: teacher?.level || "",
      phone: teacher?.phone || "",
    },
  });

  useEffect(() => {
    form.setValue("fullName", teacher?.fullName || "");
    form.setValue("level", teacher?.level || "");
    form.setValue("phone", teacher?.phone || "");
  }, [teacher]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    if (teacher?.teacherId) {
      await updateTeacher({ id: teacher.teacherId, payload: values });
    } else {
      toast.error("Teacher ID is missing.");
    }
    refetch();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl bg-black text-white">
        <DialogHeader>
          <DialogTitle>Update Teacher Informattion</DialogTitle>
          <DialogDescription>Enter new teacher information.</DialogDescription>
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
                    <Input placeholder="John Smith" {...field} />
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
                    <Input placeholder="0332580284" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MASTER">Master</SelectItem>
                        <SelectItem value="PHD">Ph.D</SelectItem>
                        <SelectItem value="PROFESSOR">Professor</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeacherForm;
