import { refreshAccessToken } from "@/api/auth";
import Loading from "@/components/Loading";
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
        "min-h-screen w-full bg-black flex",
        isPending ? "flex-col" : ""
      )}
    >
      {isPending ? <Loading /> : <Outlet />}
    </main>
  );
};

export default DashboardLayout;
