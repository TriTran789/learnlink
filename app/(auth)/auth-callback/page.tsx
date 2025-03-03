import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";

const page = async () => {
  const auth = await onAuthenticateUser();

  if (auth.status === 400 || auth.status === 500 || auth.status === 403) {
    return redirect("/sign-in");
  }

  if (auth.status === 201 || auth.status === 200) {
    return redirect("/dashboard");
  }
};

export default page;
