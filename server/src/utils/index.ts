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
