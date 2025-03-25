import { clsx, type ClassValue } from "clsx";
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge";
import { getAccessToken } from "./localStorage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const decodeAccesstoken = () => {
  const { role, id } = jwtDecode(getAccessToken() as string) as {
    role: string;
    id: string;
  };

  return { role, id };
};
