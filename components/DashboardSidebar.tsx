"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { GraduationCap, School, SquareChartGantt, Webhook } from "lucide-react";

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
      icon: (
        <School className="text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
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
      icon: (
        <Webhook className="text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
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
          <SidebarLink
            link={{
              label: "Manu Arora",
              href: "#",
              icon: (
                <Image
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 flex-shrink-0 rounded-full"
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
}

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

export default SidebarDemo;
