import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addStudentToClassApi,
  deleteStudentFromClassApi,
  getStudentForClassApi,
} from "@/apis/class";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/types";
import Loading from "@/components/Loading";
import { DataTable } from "@/components/DataTable";

const FormSchema = z.object({
  students: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type Props = {
  classId: string;
};

const StudentPageForClass = ({ classId }: Props) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      students: [],
    },
  });

  const { data, isPending, refetch } = useQuery({
    queryKey: ["students", classId],
    queryFn: () => getStudentForClassApi(classId),
  });

  const { mutateAsync: addStudentToClass, isPending: pendingAddStudent } =
    useMutation({
      mutationFn: ({
        classId,
        students,
      }: {
        classId: string;
        students: string[];
      }) => addStudentToClassApi(classId, { students }),
      onSuccess: () => {
        refetch();
        form.reset();
        toast.success("Students added successfully");
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    });

  const {
    mutateAsync: deleteStudentFromClass,
  } = useMutation({
    mutationFn: ({
      classId,
      studentId,
    }: {
      classId: string;
      studentId: string;
    }) => deleteStudentFromClassApi(classId, studentId),
    onSuccess: () => {
      refetch();
      toast.success("Student removed successfully");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await addStudentToClass({ classId, students: data.students });
  }

  if (isPending) {
    return <Loading />;
  }

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "fullName",
      header: "Full Name",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <Button
            variant="ghost"
            onClick={() =>
              deleteStudentFromClass({ classId, studentId: student.id })
            }
          >
            <X />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="flex gap-8">
      <DataTable columns={columns} data={data?.studentsInClass || []} keyFilter="fullName" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border p-8 rounded-md mt-4 min-w-2xs"
        >
          <FormField
            control={form.control}
            name="students"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Add students</FormLabel>
                </div>
                {data?.studentsNotInClass.map((student) => (
                  <FormField
                    key={student.id}
                    control={form.control}
                    name="students"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={student.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(student.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, student.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== student.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal text-nowrap">
                            {student.fullName} - {student.phone}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={pendingAddStudent}>
            {pendingAddStudent ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StudentPageForClass;
