import { SignIn } from "@clerk/nextjs";

const page = () => {
  return <SignIn afterSignOutUrl="/" />;
};

export default page;
