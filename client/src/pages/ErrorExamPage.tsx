import { Button } from "@/components/ui/button";
import PATH from "@/constants/PATH";
import { Link } from "react-router-dom";

const ErrorExamPage = () => {
  return (
    <div className=" w-full flex justify-center items-center flex-col">
      <p className="mb-4">The test results may be incorrect, please check your results again.</p>
      <Link to={PATH.DASHBOARD}>
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
};

export default ErrorExamPage;
