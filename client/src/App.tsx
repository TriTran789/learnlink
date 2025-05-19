import { useRoutes } from "react-router-dom";
import PATH from "@/constants/PATH";
import HomePage from "@/pages/HomePage";
import SignInPage from "@/pages/SignInPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import SubjectPage from "./pages/SubjectPage";
import ClassPage from "./pages/ClassPage";
import ClassDetailPage from "./pages/ClassDetailPage";

const App = () => {
  return useRoutes([
    {
      path: PATH.HOME,
      element: <HomePage />,
    },
    {
      path: PATH.SIGN_IN,
      element: <SignInPage />,
    },
    {
      path: PATH.DASHBOARD,
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <div>Dashboard Home</div>,
        },
        {
          path: PATH.TEACHERS,
          element: <TeacherPage />,
        },
        {
          path: PATH.STUDENTS,
          element: <StudentPage />,
        },
        {
          path: PATH.CLASSES,
          element: <ClassPage />,
        },
        {
          path: PATH.SUBJECTS,
          element: <SubjectPage />,
        },
        {
          path: `${PATH.CLASSES}/:classId`,
          element: <ClassDetailPage />,
        },
      ],
    },
  ]);
};

export default App;
