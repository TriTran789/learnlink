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
import ExamDetailPage from "./pages/ExamDetailPage";
import ClassDetailForTeacherPage from "./pages/ClassDetailForTeacherPage";
import LessonDetailForTeacherStudentPage from "./pages/LessonDetailForTeacherStudentPage";
import CallPage from "./pages/CallPage";
import ClassDetailForStudentPage from "./pages/ClassDetailForStudentPage";
import WaitingExamPage from "./pages/WaitingExamPage";
import DoExamPage from "./pages/DoExamPage";
import ResultPage from "./pages/ResultPage";
import ErrorExamPage from "./pages/ErrorExamPage";
import ResultTotalPage from "./pages/ResultTotalPage";
import DashboardPage from "./pages/DashboardPage";
import ChangePasswordPage from "./components/ChangePasswordPage";

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
        {
          path: `${PATH.CLASSES}/:classId/exam/:examId`,
          element: <ExamDetailPage />,
        },
        {
          path: `${PATH.CLASS_TECHER}/:classId`,
          element: <ClassDetailForTeacherPage />,
        },
        {
          path: `${PATH.CLASS_TECHER}/:classId/lesson/:lessonId`,
          element: <LessonDetailForTeacherStudentPage />,
        },
        {
          path: `${PATH.CLASS_STUDENT}/:classId`,
          element: <ClassDetailForStudentPage />,
        },
        {
          path: `${PATH.WAITING_EXAMS}/:examId`,
          element: <WaitingExamPage />,
        },
        {
          path: `${PATH.EXAM}/:examId`,
          element: <DoExamPage />,
        },
        {
          path: `${PATH.RESULT}/:examId`,
          element: <ResultPage />,
        },
        {
          path: `${PATH.ERROR_EXAM}`,
          element: <ErrorExamPage />,
        },
        {
          path: `${PATH.RESULT_TOTAL}/:examId`,
          element: <ResultTotalPage />,
        },
        {
          path: PATH.CHANGE_PASSWORD,
          element: <ChangePasswordPage />,
        }
      ],
    },
    {
      path: `${PATH.CALL}/:lessonId`,
      element: <CallPage />,
    },
  ]);
};

export default App;
