import PATH from "@/contants/Path";
import { decodeAccesstoken } from "@/lib/utils";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CheckRole = ({
  role,
  children,
}: {
  role: "root" | "student" | "teacher" | ("root" | "student" | "teacher")[];
  children: ReactNode;
}) => {
  const { role: userRole } = decodeAccesstoken();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof role === "string") {
        if (role !== userRole) {
          navigate(PATH.DASHBOARD);
        }
    } else {
        if (!role.includes(userRole)) {
            navigate(PATH.DASHBOARD);
        }
    }
    
  }, [userRole]);

  return children;
};

export default CheckRole;
