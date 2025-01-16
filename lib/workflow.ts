import { Client as WorkFlowClient } from "@upstash/workflow";
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "./config";

interface ISendEmail {
  email: string;
  subject: string;
  message: string;
}

export class QStashRepository {
  getWorkFlowClient() {
    return new WorkFlowClient({
      baseUrl: config.env.upstash.qstashUrl,
      token: config.env.upstash.qstashToken,
    });
  }

  getQstashClient() {
    return new QStashClient({
      token: config.env.upstash.qstashToken,
    });
  }

  sendEmail = async (args: ISendEmail) => {
    const { email, subject, message } = args;
    await this.getQstashClient().publishJSON({
      api: {
        name: "email",
        provider: resend({ token: config.env.resendToken }),
      },
      body: {
        from: "3illBaby <updates.dsacorp.xyz>",
        to: [email],
        subject,
        html: message,
      },
    });
  };
}
