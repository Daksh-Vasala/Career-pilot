
import { redirect } from "next/navigation";
import { getProfileServer } from "@/lib/server-api";
import { ProfileClient } from "@/features/profile/components/profile-client";

export default async function ProfilePage() {
  let profile;

  try {
    profile = await getProfileServer();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      redirect("/login");
    }

    throw error;
  }

  return <ProfileClient initialProfile={profile} />;
}
