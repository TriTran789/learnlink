import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const ContentLayout = ({
  children,
  title,
  className,
}: {
  children?: ReactNode;
  title?: string;
  className?: string;
}) => {
  return (
    <main
      className={cn("w-full py-8 flex flex-col items-center px-4 overflow-auto", className)}
    >
      <div className="w-full max-w-7xl">
        {title && <h1 className="text-3xl font-bold mb-8">{title}</h1>}
        {children}
      </div>
    </main>
  );
};

export default ContentLayout;
