import { deleteStudentApi, getAllStudents } from "@/apis/student";
import CreateStudentForm from "@/components/CreateStudentForm";
import { DataTable } from "@/components/DataTable";
import EditStudentForm from "@/components/EditStudentForm";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContentLayout from "@/layouts/ContentLayout";
import { Student } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const StudentPage = () => {
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);

  const {
    data: students,
    isPending: pendingGetStudents,
    refetch: refetchStudent,
  } = useQuery({
    queryKey: ["students"],
    queryFn: getAllStudents,
  });

  const { mutateAsync: deleteStudent } = useMutation({
    mutationFn: (id: string) => deleteStudentApi(id),
    onSuccess: () => {
      toast.success("Student deleted successfully");
      refetchStudent();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (pendingGetStudents) {
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
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => (
        <img src={row.original.imageUrl} alt="Student" className="w-32" />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                  setStudent(student);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await deleteStudent(student.id);
                  refetchStudent();
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <ContentLayout title="Students">
      <EditStudentForm
        open={open}
        setOpen={setOpen}
        refetch={refetchStudent}
        student={student}
      />
      <DataTable
        columns={columns}
        data={students || []}
        button={<CreateStudentForm refetch={refetchStudent} />}
        keyFilter="fullName"
      />
    </ContentLayout>
  );
};

export default StudentPage;
