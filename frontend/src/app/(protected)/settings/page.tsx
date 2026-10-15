
"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  LockKeyhole,
  Moon,
  Palette,
  Sun,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords(false);
  };

  const handleCancel = () => {
    resetForm();
    setShowPasswordForm(false);
  };

  const handleChangePassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword.length > 72) {
      toast.error("New password must not exceed 72 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must differ from current password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/v1/auth/change-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to change password"
        );
      }

      toast.success("Password changed successfully");
      resetForm();
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordFields = [
    {
      id: "currentPassword",
      label: "Current password",
      value: currentPassword,
      setter: setCurrentPassword,
      autoComplete: "current-password",
    },
    {
      id: "newPassword",
      label: "New password",
      value: newPassword,
      setter: setNewPassword,
      autoComplete: "new-password",
    },
    {
      id: "confirmPassword",
      label: "Confirm new password",
      value: confirmPassword,
      setter: setConfirmPassword,
      autoComplete: "new-password",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 p-5 md:p-8">
      {/* Page heading */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Customize your experience and manage your account security.
        </p>
      </header>

      {/* Appearance */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border bg-background p-3 shadow-sm">
            <Palette className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">Appearance</h2>
            <p className="text-sm text-muted-foreground">
              Choose a theme that feels comfortable to you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Light theme */}
          <button
            type="button"
            onClick={() => setTheme("light")}
            aria-pressed={resolvedTheme === "light"}
            className={`group rounded-2xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
              resolvedTheme === "light"
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "bg-background hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl border bg-background shadow-inner">
                <Sun className="size-6" />
              </div>

              <div className="flex-1">
                <p className="font-medium">Light mode</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Clean and bright
                </p>
              </div>

              <span
                className={`size-3 rounded-full border ${
                  resolvedTheme === "light"
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/40"
                }`}
              />
            </div>
          </button>

          {/* Dark theme */}
          <button
            type="button"
            onClick={() => setTheme("dark")}
            aria-pressed={resolvedTheme === "dark"}
            className={`group rounded-2xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
              resolvedTheme === "dark"
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "bg-background hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl border bg-background shadow-inner">
                <Moon className="size-6" />
              </div>

              <div className="flex-1">
                <p className="font-medium">Dark mode</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Calm and low-glare
                </p>
              </div>

              <span
                className={`size-3 rounded-full border ${
                  resolvedTheme === "dark"
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/40"
                }`}
              />
            </div>
          </button>
        </div>
      </section>

      {/* Account security */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border bg-background p-3 shadow-sm">
            <ShieldCheck className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">Account security</h2>
            <p className="text-sm text-muted-foreground">
              Manage your password and keep your account secure.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-5 shadow-sm md:p-6">
          {!showPasswordForm ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border shadow-inner">
                <LockKeyhole className="size-5" />
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-medium">Change password</h3>
                <p className="text-sm text-muted-foreground">
                  Update your password using your current password.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordForm(true)}
                className="sm:shrink-0"
              >
                Change password
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl border p-2.5 shadow-inner">
                  <LockKeyhole className="size-5" />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="font-medium">Change password</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your current password and choose a new one
                    with at least 8 characters.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleChangePassword}
                className="space-y-4"
              >
                {passwordFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                    </Label>

                    <div className="relative">
                      <Input
                        id={field.id}
                        type={showPasswords ? "text" : "password"}
                        autoComplete={field.autoComplete}
                        value={field.value}
                        onChange={(e) =>
                          field.setter(e.target.value)
                        }
                        required
                        minLength={
                          field.id === "currentPassword" ? 1 : 8
                        }
                        maxLength={72}
                        className="pr-11"
                        disabled={loading}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((visible) => !visible)
                        }
                        aria-label={
                          showPasswords
                            ? "Hide passwords"
                            : "Show passwords"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {showPasswords ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={loading}>
                    {loading
                      ? "Updating..."
                      : "Update password"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
