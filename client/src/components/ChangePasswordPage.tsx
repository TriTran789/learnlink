import ContentLayout from "@/layouts/ContentLayout";
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
import InputPassword from "./InputPassword";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { changePasswordApi, signOutApi } from "@/apis/auth";
import { useNavigate } from "react-router-dom";
import PATH from "@/constants/PATH";

const formSchema = z
  .object({
    old_password: z.string().nonempty("Old password is required").min(2).max(50),
    new_password: z.string().nonempty("New password is required").min(2).max(50),
    confirm_password: z
      .string()
      .nonempty("Confirm password is required")
      .min(2)
      .max(50),
  })
  .refine(
    (data) => data.new_password === data.confirm_password,
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    }
  );

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const { mutate: signOut } = useMutation({
      mutationFn: signOutApi,
      onSettled: () => {
        localStorage.removeItem("accessToken");
        navigate(PATH.HOME);
      },
    });

  const { mutateAsync: changePassword, isPending } = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      form.reset();
      toast.success("Password changed successfully");
      signOut();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await changePassword(values);
  }

  return (
    <ContentLayout title="Change Password">
      <div className="flex-1 flex items-center justify-center">
        <Card className="bg-black text-white w-[400px]">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Enter your new password</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="old_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old passowrd</FormLabel>
                      <FormControl>
                        <InputPassword field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New passowrd</FormLabel>
                      <FormControl>
                        <InputPassword field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm passowrd</FormLabel>
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
    </ContentLayout>
  );
};

export default ChangePasswordPage;
