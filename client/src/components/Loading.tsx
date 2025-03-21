import { Loader2 } from "lucide-react";
const Loading = () => {
  return (
    <div className="flex items-center justify-center size-full flex-1">
      <Loader2 className="stroke-white animate-spin" />
    </div>
  );
};

export default Loading;
