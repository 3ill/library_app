"use server";

import { signIn } from "@/auth";
import { AuthenticationData } from "@/data/data";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../rate-limit";
import { redirect } from "next/navigation";
import { QStashRepository } from "../workflow";
import config from "../config";

export async function signup(params: IAuthentication) {
  const { fullName, email, universityId, password, universityCard } = params;
  const qStashRepo = new QStashRepository();

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

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

    const workFlowClient = qStashRepo.getWorkFlowClient();
    await workFlowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflow/onboarding`,
      body: {
        email,
        fullName,
      },
    });

    await signInWithCredentials({
      email,
      password,
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
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) return redirect("/too-fast");

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
