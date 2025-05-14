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

export const convertToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Không thể chuyển đổi file thành base64"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Lỗi khi đọc file"));
    };
    reader.readAsDataURL(file);
  });
};