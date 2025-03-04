import Header from "@/components/Header";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default layout;
