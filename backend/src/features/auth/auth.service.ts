import { and, eq, gt } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { users } from "../../db/schema/user.ts";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/api-error.ts";
import { createHash, randomBytes } from "crypto";
import { passwordResetTokens } from "../../db/schema/password-reset-token.ts";
import { sendPasswordResetEmail } from "../../lib/email.ts";

const userColumns = {
  id: users.id,
  firstName: users.firstName,
  lastName: users.lastName,
  email: users.email,
};

export const registerService = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  const [existingUser] = await db
    .select(userColumns)
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({ firstName, lastName, email, passwordHash })
    .returning(userColumns);

  return newUser;
};

export const loginService = async (email: string, password: string) => {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!existingUser) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, existingUser.passwordHash);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  return {
    id: existingUser.id,
    email: existingUser.email,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
  };
};

export const getMeService = async (userId: string) => {
  const [user] = await db
    .select(userColumns)
    .from(users)
    .where(eq(users.id, userId));

  return user;
};

const hashResetToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

export const forgotPasswordService = async (email: string) => {
  const [user] = await db
    .select(userColumns)
    .from(users)
    .where(eq(users.email, email));

  if (!user) return null;

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await db.transaction(async (tx) => {
    // Remove previous reset tokens for this user.
    await tx
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id));

    await tx.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });
  });

  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    throw new ApiError(500, "Password reset is not configured");
  }

  const resetUrl = `${frontendUrl.replace(/\/$/, "")}/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail({
    to: user.email,
    resetUrl,
  });
};

export const resetPasswordService = async (
  token: string,
  newPassword: string,
): Promise<void> => {
  const tokenHash = hashResetToken(token);

  const [resetToken] = await db
    .select({
      id: passwordResetTokens.id,
      userId: passwordResetTokens.userId,
    })
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        gt(passwordResetTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!resetToken) {
    throw new ApiError(400, "Invalid or expired password reset link");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db.transaction(async (tx) => {
    // Recheck and consume the token atomically to prevent reuse.
    const [consumedToken] = await tx
      .delete(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.id, resetToken.id),
          eq(passwordResetTokens.tokenHash, tokenHash),
          gt(passwordResetTokens.expiresAt, new Date()),
        ),
      )
      .returning({ userId: passwordResetTokens.userId });

    if (!consumedToken) {
      throw new ApiError(400, "Invalid or expired password reset link");
    }

    await tx
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, consumedToken.userId));
  });
};
