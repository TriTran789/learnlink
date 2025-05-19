import { deleteTeacherApi, getTeachers } from "@/apis/teacher";
import CreateTeacherForm from "@/components/CreateTeacherForm";
import { DataTable } from "@/components/DataTable";
import Loading from "@/components/Loading";
import ContentLayout from "@/layouts/ContentLayout";
import { Teacher } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import EditTeacherForm from "@/components/EditTeacherForm";

const TeacherPage = () => {
  const [open, setOpen] = useState(false);
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  const {
    data: teachers,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const { mutateAsync: deleteTeacher } = useMutation({
    mutationFn: deleteTeacherApi,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const columns: ColumnDef<Teacher>[] = [
    {
      accessorKey: "fullName",
      header: "Full Name",
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const teacher = row.original;

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
                  setTeacher(teacher);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await deleteTeacher(teacher.userId);
                  refetch();
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

  if (isPending) {
    return <Loading />;
  }

  return (
    <ContentLayout title="Teachers">
      <EditTeacherForm
        open={open}
        setOpen={setOpen}
        teacher={teacher}
        refetch={refetch}
      />
      <DataTable
        columns={columns}
        data={teachers || []}
        button={<CreateTeacherForm refetch={refetch} />}
        keyFilter="fullName"
      />
    </ContentLayout>
  );
};

export default TeacherPage;
