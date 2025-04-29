import MySidebar from "@/components/MySidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <main className="h-screen bg-black text-white flex flex-col md:flex-row">
      <MySidebar />
      <Outlet />
    </main>
  );
};

export default DashboardLayout;
