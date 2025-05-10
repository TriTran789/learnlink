import { useRoutes } from "react-router-dom";
import PATH from "@/constants/PATH";
import HomePage from "@/pages/HomePage";
import SignInPage from "@/pages/SignInPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";

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
          element: <div>Classes</div>,
        },
        {
          path: PATH.SUBJECTS,
          element: <div>Subjects</div>,
        },
      ],
    },
  ]);
};

export default App;
