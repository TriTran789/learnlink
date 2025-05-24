import { decodeAccesstoken } from "@/lib/utils";
import { useSidebar } from "./ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
import { studentGetClassesApi } from "@/apis/class";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import { Link } from "react-router-dom";
import PATH from "@/constants/PATH";

const StudentSidebarItems = () => {
  const { profileId } = decodeAccesstoken();
  const { setOpen } = useSidebar();

  const { data, isPending } = useQuery({
    queryKey: ["studentSidebarItems"],
    queryFn: () => studentGetClassesApi(profileId),
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <ScrollArea className="w-full max-h-96">
      <Label className="mb-2 text-base font-semibold">Classes</Label>
      {data?.map((item) => (
        <Link
          to={`${PATH.CLASS_STUDENT}/${item.id}`}
          key={item.id}
          onClick={() => setOpen(false)}
        >
          <div className="px-4 py-2 rounded-lg hover:bg-white/30">
            {item.name}
          </div>
        </Link>
      ))}
    </ScrollArea>
  );
};

export default StudentSidebarItems;
