import { deleteSubjectApi, getAllSubjectsApi } from "@/apis/subject";
import CreateSubjectForm from "@/components/CreateSubjectForm";
import { DataTable } from "@/components/DataTable";
import EditSubjectForm from "@/components/EditSubjectForm";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContentLayout from "@/layouts/ContentLayout";
import { Subject } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SubjectPage = () => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState<Subject | null>(null);

  const {
    data: subjects,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: getAllSubjectsApi,
  });

  const { mutateAsync } = useMutation({
    mutationFn: (id: string) => deleteSubjectApi(id),
    onSuccess: () => {
      toast.success("Subject deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isPending) {
    return <Loading />;
  }

  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const subject = row.original;

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
                  setSubject(subject);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await mutateAsync(subject.id);
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

  return (
    <ContentLayout title="Subjects">
      <EditSubjectForm
        refetch={refetch}
        open={open}
        setOpen={setOpen}
        subject={subject}
      />
      <DataTable
        columns={columns}
        data={subjects || []}
        button={<CreateSubjectForm refetch={refetch} />}
        keyFilter="name"
      />
    </ContentLayout>
  );
};

export default SubjectPage;
