"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { AlignJustify, ArrowRight, User } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { getAvatar } from "@/actions/user";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, signOut } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
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

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header
      className={cn(
        isScrolled ? "border-white/[0.1]" : "border-transparent",
        "sticky top-0 z-[50] w-full border-b"
      )}
    >
      <div className="px-8 flex h-16 items-center justify-between max-w-[88rem] mx-auto">
        <Link href="/" className="flex items-center text-2xl gap-2">
          <Button
            variant="outline"
            className="block lg:hidden bg-transparent border-white/[0.3]"
          >
            <AlignJustify />
          </Button>
          <Image src="/logo.png" alt="logo" width={48} height={48} />
          <span className="hidden lg:block">LearnLink</span>
        </Link>
        {isSignedIn ? (
          <div className="flex gap-4 items-center">
            {!pathname.includes("dashboard") && (
              <Link href="/dashboard">
                <Button>
                  Dashboard <ArrowRight />
                </Button>
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="ring-1 ring-white/[0.3] cursor-pointer">
                  <AvatarImage src={avatar?.image || ""} />
                  <AvatarFallback className="bg-black">
                    <User />
                  </AvatarFallback>
                </Avatar>
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
        ) : (
          !pathname.includes("sign-in") && (
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )
        )}
      </div>
    </header>
  );
};

export default Header;
