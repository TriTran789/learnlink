import { ReactNode, useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { CircleUserRound, GraduationCap, LogOut, UserRoundCog, UsersRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LogoPng from "@/assets/logo.png";
import PATH from "@/contants/Path";
import { cn, decodeAccesstoken } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { signOutApi } from "@/api/auth";

export const Logo = () => {
  return (
    <Link
      to={PATH.HOME}
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <img src={LogoPng} className="size-6" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white"
      >
        LearnLink
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      to={PATH.HOME}
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <img src={LogoPng} className="size-6" />
    </Link>
  );
};

const MySidebar = () => {
  const { role } = decodeAccesstoken();

  const navigate = useNavigate();

  const [links, setLinks] = useState<
    { label: string; href: string; icon: ReactNode }[]
  >([]);

  const { mutate: signOut } = useMutation({
    mutationFn: signOutApi,
    onSuccess: () => {
      navigate(PATH.HOME);
    },
  });

  useEffect(() => {
    if (role === "root") {
      setLinks([
        {
          label: "Teachers",
          href: PATH.TEACHERS,
          icon: <UserRoundCog size={20} />,
        },
        {
          label: "Students",
          href: PATH.STUDENTS,
          icon: <UsersRound size={20} />,
        },
        {
          label: "Classes",
          href: PATH.CLASSES,
          icon: <GraduationCap size={20} />,
        },
      ]);
    }
  }, [role]);

  const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="bg-black border-r border-b border-[#262626] md:h-screen justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <div className="hidden md:block">
            {open ? <Logo /> : <LogoIcon />}
          </div>
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
            <button
              className={cn(
                "flex items-center justify-start gap-2  group/sidebar py-2 cursor-pointer"
              )}
              onClick={() => {
                console.log("alo");
                signOut();
              }}
            >
              <LogOut size={20} />

              <motion.span
                animate={{
                  display: true
                    ? open
                      ? "inline-block"
                      : "none"
                    : "inline-block",
                  opacity: true ? (open ? 1 : 0) : 1,
                }}
                className="text-white text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
              >
                Sign Out
              </motion.span>
            </button>
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Manu Arora",
              href: "#",
              icon: <CircleUserRound size={20} />,
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export default MySidebar;
