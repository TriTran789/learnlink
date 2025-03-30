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
import Header from "@/components/Header";
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
import { useMutation } from "@tanstack/react-query";
import { signInApi } from "@/api/auth";
import { setAccessToken } from "@/lib/localStorage";
import { useNavigate } from "react-router-dom";
import PATH from "@/contants/Path";
import { toast } from "sonner";
import InputPassword from "@/components/InputPassword";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(100),
});

const SignInPage = () => {
  const navigate = useNavigate();

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: signInApi,
    onSuccess: (data) => {
      toast.success(data.message);
      setAccessToken(data.accessToken);
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
    signIn(values);
  }

  return (
    <main className="bg-black w-full h-screen flex flex-col">
      <Header hiddenButton />
      <div className="w-full flex-1 flex justify-center items-center">
        <Card className="w-[400px] bg-transparent">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your account information.</CardDescription>
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
                <Button disabled={isPending} type="submit">
                  {isPending ? <Loader2 className="animate-spin stroke-black" /> : "Submit"}
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
