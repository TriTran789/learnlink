import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const decodeAccesstoken = () => {
  const { id, role, profileId } = jwtDecode(
    localStorage.getItem("accessToken") || ""
  ) as {
    id: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
    profileId: string;
  };

  return { id, role, profileId };
};