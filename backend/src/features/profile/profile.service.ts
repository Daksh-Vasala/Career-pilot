import { db } from "../../db/index.js";
import { users } from "../../db/schema/user.ts";
import { eq } from "drizzle-orm";
import { ApiError } from "../../utils/api-error.ts";
import { profiles } from "../../db/schema/profile.ts";
import { UpdateProfileData } from "./profile.types.ts";

const userColumns = {
  id: users.id,
  email: users.email,
  firstName: users.firstName,
  lastName: users.lastName,
};

const profileColumns = {
  id: profiles.id,
  phoneNumber: profiles.phoneNumber,
  linkedinUrl: profiles.linkedinUrl,
  githubUrl: profiles.githubUrl,
  portfolioUrl: profiles.portfolioUrl,
  location: profiles.location,
  bio: profiles.bio,
};

export const getProfileService = async (userId: string) => {
  const [user] = await db
    .select(userColumns)
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const [profile] = await db
    .select(profileColumns)
    .from(profiles)
    .where(eq(profiles.userId, userId));

  return {
    ...user,
    profile: profile ?? null,
  };
};

export const updateProfileService = async (
  userId: string,
  data: UpdateProfileData,
) => {
  const [user] = await db
    .select(userColumns)
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const {
    firstName,
    lastName,
    phoneNumber,
    linkedinUrl,
    githubUrl,
    portfolioUrl,
    location,
    bio,
  } = data;

  const [existingProfile] = await db
    .select(profileColumns)
    .from(profiles)
    .where(eq(profiles.userId, userId));

  const noChanges =
    (firstName === undefined || firstName === user.firstName) &&
    (lastName === undefined || lastName === user.lastName) &&
    (phoneNumber === undefined ||
      phoneNumber === (existingProfile?.phoneNumber ?? null)) &&
    (linkedinUrl === undefined ||
      linkedinUrl === (existingProfile?.linkedinUrl ?? null)) &&
    (githubUrl === undefined ||
      githubUrl === (existingProfile?.githubUrl ?? null)) &&
    (portfolioUrl === undefined ||
      portfolioUrl === (existingProfile?.portfolioUrl ?? null)) &&
    (location === undefined ||
      location === (existingProfile?.location ?? null)) &&
    (bio === undefined || bio === (existingProfile?.bio ?? null));

  if (noChanges) {
    throw new ApiError(400, "No fields to update");
  }

  const profileData = {
    phoneNumber,
    linkedinUrl,
    githubUrl,
    portfolioUrl,
    location,
    bio,
  };

  await db.transaction(async (tx) => {
    if (firstName !== undefined || lastName !== undefined) {
      await tx
        .update(users)
        .set({
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning(userColumns);
    }

    if (existingProfile) {
      await tx
        .update(profiles)
        .set({
          ...(phoneNumber !== undefined && { phoneNumber }),
          ...(linkedinUrl !== undefined && { linkedinUrl }),
          ...(githubUrl !== undefined && { githubUrl }),
          ...(portfolioUrl !== undefined && { portfolioUrl }),
          ...(location !== undefined && { location }),
          ...(bio !== undefined && { bio }),
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, userId));
    } else {
      await tx.insert(profiles).values({
        userId,
        phoneNumber: phoneNumber ?? null,
        linkedinUrl: linkedinUrl ?? null,
        githubUrl: githubUrl ?? null,
        portfolioUrl: portfolioUrl ?? null,
        location: location ?? null,
        bio: bio ?? null,
      });
    }
  });

  return getProfileService(userId);
};
