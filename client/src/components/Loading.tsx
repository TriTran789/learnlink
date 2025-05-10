import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="size-full flex-1 flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}

export default Loading