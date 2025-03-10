import DashboardSidebar from "@/components/DashboardSidebar";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-screen flex">
      <DashboardSidebar />
      {children}
    </div>
  );
};

export default layout;
