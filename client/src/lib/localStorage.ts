// Hàm lấy access token từ localStorage
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem("accessToken", accessToken);
};
