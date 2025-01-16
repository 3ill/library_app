import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { QStashRepository } from "@/lib/workflow";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";

interface InitialData {
  email: string;
  fullName: string;
}

type UserState = "non-active" | "active";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (
  email: Pick<InitialData, "email">,
): Promise<UserState> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email.email))
    .limit(1);

  if (user.length === 0) return "non-active";

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - lastActivityDate.getTime();

  if (
    timeDifference > THREE_DAYS_IN_MS &&
    timeDifference <= THIRTY_DAYS_IN_MS
  ) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;
  const qstashRepo = new QStashRepository();

  // Send welcome email on new signups
  await context.run("new-signup", async () => {
    await qstashRepo.sendEmail({
      email,
      subject: "Welcome to BookWise",
      message: `Welcome ${fullName}`,
    });
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState({ email });
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await qstashRepo.sendEmail({
          email,
          subject: "Are you still there",
          message: `Hey ${fullName}, We Miss You!`,
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await qstashRepo.sendEmail({
          email,
          subject: "This User Is Active",
          message: `Keep it up ${fullName}`,
        });
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});
