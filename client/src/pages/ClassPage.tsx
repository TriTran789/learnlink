import { getAllClassesApi } from "@/apis/class";
import CreateClassForm from "@/components/CreateClassForm";
import { DataTable } from "@/components/DataTable";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import PATH from "@/constants/PATH";
import ContentLayout from "@/layouts/ContentLayout";
import { Class } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ClassPage = () => {
  const { data: classes, isPending: pendingGetAllClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: getAllClassesApi,
  });

  if (pendingGetAllClasses) {
    return <Loading />;
  }

  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: "name",
      header: "Class Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "teacher_name",
      header: "Teacher Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "subject_name",
      header: "Subject Name",
      cell: (info) => info.getValue(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const classItem = row.original;
        return (
          <Link to={`${PATH.CLASSES}/${classItem.id}`}>
            <Button variant="ghost">
              Details
              <ArrowRight />
            </Button>
          </Link>
        );
      },
    },
  ];

  return (
    <ContentLayout title="Classes">
      <DataTable
        columns={columns}
        data={classes || []}
        button={<CreateClassForm />}
      />
    </ContentLayout>
  );
};

export default ClassPage;
