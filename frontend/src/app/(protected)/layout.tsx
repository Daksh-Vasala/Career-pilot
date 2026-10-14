"use client";

import { useAuth } from "@/features/auth/auth-context";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Protectedlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [router, isLoading, user]);

  if (isLoading || !user) {
    return null;
  }
  return <DashboardShell>{children}</DashboardShell>;
}
