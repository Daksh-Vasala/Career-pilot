"use client";

import { useAuth } from "@/features/auth/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [router, isLoading, user]);

  if (isLoading || user) return null;

  return <>{children}</>;
}
