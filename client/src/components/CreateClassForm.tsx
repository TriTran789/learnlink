import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getTeachers } from "@/apis/teacher";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
import { getAllSubjectsApi } from "@/apis/subject";
import { Input } from "./ui/input";
import { useState } from "react";
import { createClassApi } from "@/apis/class";
import { toast } from "sonner";

const FormSchema = z.object({
  teacher_id: z.string({
    required_error: "Please select a teacher.",
  }),
  subject_id: z.string({
    required_error: "Please select a subject.",
  }),
  name: z.string().nonempty("Please enter a class name."),
});

export default function CreateClassForm() {
  const [open, setOpen] = useState(false);

  const { data: teachers, isPending: pendingGetTeachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const { data: subjects, isPending: pendingGetSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: getAllSubjectsApi,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { mutateAsync: createClass, isPending: pendingCreateClass } =
    useMutation({
      mutationFn: createClassApi,
      onSuccess: () => {
        form.reset();
        setOpen(false);
        toast.success("Class created successfully");
      },
      onError: (error) => {
        console.error(error.message);
      },
    });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await createClass(data);
  }

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>New</Button>
      </DialogTrigger>
      <DialogContent className="bg-black text-white">
        {pendingGetTeachers || pendingGetSubjects ? (
          <Loading />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create Class</DialogTitle>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teacher_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between text-black",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? teachers?.find(
                                      (teacher) =>
                                        teacher.teacherId === field.value
                                    )?.fullName
                                  : "Select a teacher..."}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput placeholder="Search..." />
                              <CommandList>
                                <CommandEmpty>No result found</CommandEmpty>
                                <CommandGroup>
                                  {teachers?.map((teacher) => (
                                    <CommandItem
                                      value={teacher.fullName}
                                      key={teacher.teacherId}
                                      onSelect={() => {
                                        form.setValue(
                                          "teacher_id",
                                          teacher.teacherId
                                        );
                                      }}
                                    >
                                      {teacher.fullName}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          teacher.teacherId === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between text-black",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? subjects?.find(
                                      (subject) => subject.id === field.value
                                    )?.name
                                  : "Select a subject..."}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput placeholder="Search..." />
                              <CommandList>
                                <CommandEmpty>No result found</CommandEmpty>
                                <CommandGroup>
                                  {subjects?.map((subject) => (
                                    <CommandItem
                                      value={subject.name}
                                      key={subject.id}
                                      onSelect={() => {
                                        form.setValue("subject_id", subject.id);
                                      }}
                                    >
                                      {subject.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          subject.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={pendingCreateClass}>
                    {pendingCreateClass ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
