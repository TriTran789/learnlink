import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputPassword from "@/components/InputPassword";
import { useMutation } from "@tanstack/react-query";
import { signInApi } from "@/apis/auth";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PATH from "@/constants/PATH";

const formSchema = z.object({
  email: z.string().email("Invalid Email").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

const SignInPage = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signInApi,
    onSuccess: (data) => {
      toast.success(data.message);
      localStorage.setItem("accessToken", data.accessToken);
      navigate(PATH.HOME);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    mutate(values);
  }
  return (
    <main className="h-screen bg-black text-white flex flex-col">
      <Header hiddenButton />
      <div className="w-full flex-1 flex justify-center items-center">
        <Card className="w-[400px] bg-black text-white">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email and password.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <InputPassword field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SignInPage;
