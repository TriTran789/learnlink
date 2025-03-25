import { Navigate, useRoutes } from "react-router-dom";
import PATH from "@/contants/Path";
import HomePage from "@/pages/HomePage";
import SignInPage from "@/pages/SignInPage";
import DashboardPage from "@/pages/DashboardPage";
import DashboardLayout from "./layouts/DashboardLayout";

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
          element: <DashboardPage />,
        },
        {
          path: PATH.TEACHERS,
          element: <div>Teachers</div>,
        },
        {
          path: PATH.STUDENTS,
          element: <div>Students</div>,
        },
        {
          path: PATH.CLASSES,
          element: <div>Classes</div>,
        }
      ],
    },
    {
      path: "*",
      element: <Navigate to={PATH.HOME} />,
    },
  ]);
};

export default App;
