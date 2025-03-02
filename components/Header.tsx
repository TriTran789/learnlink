"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

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
        <Link href="/" className="flex items-center text-2xl gap-2">
          <Image src="/logo.png" alt="logo" width={48} height={48} />
          LearnLink
        </Link>
        {!pathname.includes("sign-in") &&
          (isSignedIn ? (
            <Link href="/dashboard">
              <Button>
                Dashboard <ArrowRight />
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          ))}
      </div>
    </header>
  );
};

export default Header;
