"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/features/auth/auth.service";
import { useAuth } from "../auth-context";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();

  async function handleLogout() {
    try {
      setIsLoading(true);
      await logoutUser();

      toast.success("Logged out successfully");
      setUser(null);
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
