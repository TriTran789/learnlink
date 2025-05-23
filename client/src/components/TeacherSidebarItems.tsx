import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "./ui/scroll-area";
import Loading from "./Loading";
import { teacherGetClassesApi } from "@/apis/class";
import { decodeAccesstoken } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Label } from "./ui/label";
import PATH from "@/constants/PATH";

const TeacherSidebarItems = () => {
  const { profileId } = decodeAccesstoken();

  const { data, isPending } = useQuery({
    queryKey: ["teacherSidebarItems"],
    queryFn: () => teacherGetClassesApi(profileId),
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <ScrollArea className="w-full max-h-96">
      <Label className="mb-2 text-base font-semibold">Classes</Label>
      {data?.map((item) => (
        <Link to={`${PATH.CLASS_TECHER}/${item.id}`} key={item.id}>
          <div className="px-4 py-2 rounded-lg hover:bg-white/30">
            {item.name}
          </div>
        </Link>
      ))}
    </ScrollArea>
  );
};

export default TeacherSidebarItems;
