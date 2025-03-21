import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import PATH from "@/contants/Path";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { checkAuthStatus } from "@/api/auth";
import { ArrowRight } from "lucide-react";

type Props = {
  hiddenButton?: boolean;
};

const Header = ({ hiddenButton }: Props) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const { mutate, data } = useMutation({
    mutationFn: checkAuthStatus,
  });

  useEffect(() => {
    !hiddenButton && mutate();
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
        "sticky top-0 z-50 w-full border-b",
        isScrolled ? "border-white/[0.1]" : "border-transparent"
      )}
    >
      <div className="px-8 flex h-16 items-center max-w-[88rem] mx-auto justify-between">
        <Link
          to={PATH.HOME}
          className="flex gap-2 items-center text-2xl font-bold"
        >
          <img src={logo} alt="logo" className="size-12" />
          LearnLink
        </Link>
        {data?.success ? (
          <Link to={PATH.DASHBOARD}>
            <Button>
              Dashboard <ArrowRight className="stroke-black" />
            </Button>
          </Link>
        ) : (
          <>
            {hiddenButton ? (
              <div></div>
            ) : (
              <Link to={PATH.SIGN_IN}>
                <Button>Sign In</Button>
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
