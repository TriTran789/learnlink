import { refreshAccessToken } from "@/api/auth";
import Loading from "@/components/Loading";
import MySidebar from "@/components/MySidebar";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: refreshAccessToken,
  });

  useEffect(() => {
    mutate();
  }, []);

  return (
    <main
      className={cn(
        "min-h-screen w-full bg-black flex md:flex-row flex-col",
        isPending ? "flex-col" : ""
      )}
    >
      {isPending ? (
        <Loading />
      ) : (
        <>
          <MySidebar />
          <Outlet />
        </>
      )}
    </main>
  );
};

export default DashboardLayout;
