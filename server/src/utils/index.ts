import path from "path";
import fs from "fs";

export function generateRandomString(length: number = 10): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export const generateHTML = (role: "Student" | "Teacher", password: string) => {
  return `
            <div style="background-color: black;">
                <div style="background-color: #f2f2f2; padding: 20px; text-align: center;">
                    <h1 style="color: #333;">Welcome to Learnlink</h1>
                    <p style="color: #555;">Your account has been created successfully.</p>
                    <p style="color: #555;">Role: ${role}</p>
                    <p style="color: #555;">Password: ${password}</p>
                    <p style="color: #555;">Please change your password after logging in.</p>
                </div>
            </div>
    `;
};

// Convert base64 thành file tạm thời
export const saveBase64AsFile = (base64Data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Loại bỏ phần header của base64 nếu có (ví dụ: data:image/jpeg;base64,)
    const base64Image = base64Data.split(';base64,').pop() || base64Data;
    
    // Tạo file tạm
    const tempFilePath = path.join(__dirname, `../temp/${Date.now()}.jpg`);
    
    // Đảm bảo thư mục temp tồn tại
    const tempDir = path.dirname(tempFilePath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    fs.writeFile(tempFilePath, base64Image, {encoding: 'base64'}, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(tempFilePath);
      }
    });
  });
};

// Xóa file tạm sau khi sử dụng
export const cleanupTempFile = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};