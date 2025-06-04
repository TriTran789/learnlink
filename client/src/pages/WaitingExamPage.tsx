import { Button } from "@/components/ui/button";
import PATH from "@/constants/PATH";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const WaitingExamPage = () => {
  const { examId } = useParams<{ examId: string }>();

  const [permission, setPermission] = useState<
    "checking" | "granted" | "denied" | "prompt"
  >("checking");

  // Kiểm tra quyền camera khi component mount
  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      // Kiểm tra xem trình duyệt có hỗ trợ API quyền không
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        setPermission(permission.state);

        // Lắng nghe thay đổi quyền
        permission.addEventListener("change", () => {
          setPermission(permission.state);
        });
      }
    } catch (error) {
      console.error("Error checking camera permission:", error);
      setPermission("prompt");
    }
  };

  const requestCameraPermission = async () => {
    try {
      setPermission("checking");

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Dừng stream ngay sau khi được cấp quyền
      stream.getTracks().forEach((track) => track.stop());

      setPermission("granted");
    } catch (err: any) {
      console.error("Error requesting camera permissions:", err);

      if (err.name === "NotAllowedError") {
        setPermission("denied");
      }
    }
  };

  const renderContent = () => {
    switch (permission) {
      case "checking":
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Checking camera permissions...</p>
          </div>
        );

      case "granted":
        return (
          <Link to={`${PATH.EXAM}/${examId}`}>
            <Button>Do Exam</Button>
          </Link>
        );

      case "denied":
        return (
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">✗</div>
            <p className="text-red-600 mb-2">Camera permission denied</p>
            <p className="text-sm text-gray-600 mb-4">
              Please go to your browser settings to allow camera permissions for
              this site.
            </p>
          </div>
        );

      case "prompt":
      default:
        return (
          <div className="text-center">
            <div className="text-yellow-500 text-4xl mb-4">📷</div>
            <p className="text-gray-700 mb-4">App needs camera access</p>
            <button
              onClick={requestCameraPermission}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Camera Permissions
            </button>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex justify-center items-center flex-col">
      {renderContent()}
    </div>
  );
};

export default WaitingExamPage;
