"use server";

import { signIn } from "@/auth";
import { AuthenticationData } from "@/data/data";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export async function signup(params: IAuthentication) {
  const { fullName, email, universityId, password, universityCard } = params;
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length > 0) {
    return {
      success: false,
      message: AuthenticationData.SIGN_UP_FAILED,
    };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    return {
      success: true,
      message: AuthenticationData.SIGN_UP_SUCCESS,
    };
  } catch (e: any) {
    console.error(e.message || e);
    return {
      success: false,
      message: AuthenticationData.SIGN_UP_FAILED,
    };
  }
}

export async function signInWithCredentials(
  params: Pick<IAuthentication, "email" | "password">,
) {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        message: result.error,
      };
    }

    return {
      success: true,
      message: AuthenticationData.SIGN_IN_SUCCESS,
    };
  } catch (e: any) {
    console.error(e.message);
    return {
      success: false,
      message: AuthenticationData.SIGN_IN_FAILED,
    };
  }
}
