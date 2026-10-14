import { api } from "@/lib/api-client";
import type { DashboardSummaryResponse } from "@/features/dashboard/dashboard.types.ts";

export async function getDashboardSummary() {
  const response =
    await api.get<DashboardSummaryResponse>("/dashboard/summary");

  return response.data.data;
}
