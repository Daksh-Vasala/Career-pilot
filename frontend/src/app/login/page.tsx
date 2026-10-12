"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormField from "@/features/auth/components/form-field";
import { useForm } from "react-hook-form";
import { loginInput } from "@/features/auth/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PasswordInput from "@/features/auth/components/password-input";
import { loginUser } from "@/features/auth/auth.service";
import { toast } from "sonner";

type LoginFormValues = z.infer<typeof loginInput>;
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginInput),
    mode: "onBlur",
  });

  const submitHandler = async (data: LoginFormValues) => {
    try {
      const res = await loginUser({
        email: data.email,
        password: data.password,
      });
      toast.success(res.message || "User logged in");
    } catch (error) {
      console.log("Error in logging user: ", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="absolute right-5 top-5">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-md rounded-2xl border-border bg-card shadow-[6px_6px_14px_#D7D8D2,-6px_-6px_14px_#FFFFFF] dark:shadow-[6px_6px_14px_#101614,-6px_-6px_14px_#222D29]">
        <CardHeader className="space-y-2 pb-6">
          <Link
            href="/"
            className="mb-3 text-sm text-muted-foreground hover:text-primary"
          >
            ← Back to CareerPilot
          </Link>

          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>

          <CardDescription>
            Sign in to continue managing your career.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
            <FormField
              registration={register("email")}
              error={errors.email?.message}
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required={true}
            />

            <div className="space-y-2">
              <PasswordInput
                id="password"
                label="Password"
                placeholder="Enter your password"
                autoComplete="new-password"
                required={true}
                registration={register("password")}
                error={errors.password?.message}
              />
              <div className="flex">
                <Link
                  href="/forgot-password"
                  className="text-sm text-right w-full font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
