import CreateStudentForm from "@/components/CreateStudentForm";
import { DataTable } from "@/components/DataTable";
import ContentLayout from "@/layouts/ContentLayout";

const StudentPage = () => {
  return (
    <ContentLayout title="Students">
      <DataTable columns={[]} data={[]} button={<CreateStudentForm />} />
    </ContentLayout>
  );
};

export default StudentPage;
