import Header from "@/components/Header";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="w-full flex-1 flex items-center justify-center">
        {children}
      </div>
    </>
  );
};

export default layout;
