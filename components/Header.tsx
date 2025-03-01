"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        isScrolled ? "border-white/[0.1]" : "border-transparent",
        "sticky top-0 z-[50] w-full border-b"
      )}
    >
      <div className="px-8 flex h-16 items-center justify-between max-w-[88rem] mx-auto">
        <div className="flex items-center text-2xl gap-2">
          <Image src="/logo.png" alt="logo" width={48} height={48} />
          LearnLink
        </div>
      </div>
    </header>
  );
};

export default Header;
