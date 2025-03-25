import { ReactNode, useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { GraduationCap, UserRoundCog, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LogoPng from "@/assets/logo.png";
import PATH from "@/contants/Path";
import { decodeAccesstoken } from "@/lib/utils";

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

  const [links, setLinks] = useState<
    { label: string; href: string; icon: ReactNode }[]
  >([]);

  useEffect(() => {
    if (role === "root") {
      setLinks([
        {
          label: "Teachers",
          href: "#",
          icon: (
            <UserRoundCog size={20} />
          ),
        },
        {
          label: "Students",
          href: "#",
          icon: <UsersRound size={20} />,
        },
        {
          label: "Classes",
          href: "#",
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
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Manu Arora",
              href: "#",
              icon: (
                <img
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export default MySidebar;
