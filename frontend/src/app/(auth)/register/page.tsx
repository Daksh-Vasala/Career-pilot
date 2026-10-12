"use client";

import FormField from "@/features/auth/components/form-field";
import { ModeToggle } from "@/components/mode-toggle";
import PasswordInput from "@/features/auth/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerInput } from "@/features/auth/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { registerUser } from "@/features/auth/auth.service";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  type RegisterFormValues = z.infer<typeof registerInput>;
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerInput),
    mode: "onBlur",
  });

  const router = useRouter();

  const submitHandler = async (data: RegisterFormValues) => {
    try {
      const res = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      toast.success(res.message || "User registered");
      router.replace("/dashboard");
    } catch (error) {
      console.log("Error in registering user: ", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="relative flex justify-center min-h-screen items-center bg-background px-4 py-12 text-foreground">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>

      <Card className="border-border bg-card w-full max-w-md text-foreground shadow-[6px_6px_14px_#D7D8D2,-6px_-6px_14px_#FFFFFF] dark:shadow-[6px_6px_14px_#101614,-6px_-6px_14px_#222D29]">
        <CardHeader className="space-y-2 pb-6">
          <Link href="/" className="text-muted-foreground">
            ← Back to home
          </Link>
          <CardTitle className="font-semibold text-2xl tracking-tight">
            Build your next career move
          </CardTitle>

          <CardDescription>One workspace for your job search.</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
            <FormField
              registration={register("firstName")}
              error={errors.firstName?.message}
              id="firstName"
              label="First name"
              type="text"
              placeholder="John"
              autoComplete="given-name"
              required={true}
            />

            <FormField
              registration={register("lastName")}
              error={errors.lastName?.message}
              id="lastName"
              label="Last name"
              type="text"
              placeholder="Doe"
              autoComplete="family-name"
              required={true}
            />

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

            <PasswordInput
              id="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="new-password"
              required={true}
              registration={register("password")}
              error={errors.password?.message}
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm password"
              placeholder="Re-enter password"
              autoComplete="new-password"
              required={true}
              registration={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={"/login"}
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
