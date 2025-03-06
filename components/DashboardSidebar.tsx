"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  School,
  SquareChartGantt,
  User,
  Webhook,
} from "lucide-react";
import { getAvatar } from "@/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export function SidebarDemo() {
  const links = [
    {
      label: "Classes",
      href: "/dashboard/classes",
      icon: (
        <GraduationCap className="text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Own Classes",
      href: "/dashboard/own-classes",
      icon: <School className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Assignments",
      href: "/dashboard/assignments",
      icon: (
        <SquareChartGantt className="text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "AI Tutor",
      href: "/dashboard/ai-tutor",
      icon: <Webhook className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const router = useRouter();
  const { signOut } = useAuth();

  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState<{
    image: string | null | undefined;
    lastname: string | null | undefined;
    firstname: string | null | undefined;
  }>();

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const result = await getAvatar();
        setAvatar(result);
      } catch (error) {
        console.log(error);
      }
    };
    loadAvatar();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 bg-[#262626]">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Link href="/" className="flex items-center gap-4 text-xl">
            <Image
              src="/logo.png"
              alt="logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            LearnLink
          </Link>
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <SidebarLink
                link={{
                  label:
                    `${avatar?.firstname} ${avatar?.lastname}` ||
                    "Your Account",
                  href: "#",
                  icon: (
                    <Avatar className="ring-1 ring-white/[0.3] cursor-pointer">
                      <AvatarImage src={avatar?.image || ""} />
                      <AvatarFallback className="bg-black">
                        <User />
                      </AvatarFallback>
                    </Avatar>
                  ),
                }}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-white/[0.3]">
              <DropdownMenuLabel className="text-white">
                {avatar?.firstname} {avatar?.lastname}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/[0.3]" />
              <DropdownMenuItem
                className="text-white/[0.8] cursor-pointer"
                onClick={handleSignOut}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export default SidebarDemo;
