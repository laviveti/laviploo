import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false, // Desabilita login com senha
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        // Aqui você implementaria o envio do email
        // Por enquanto, vamos apenas logar no console
        console.log("Magic link para:", email);
        console.log("URL:", url);
        console.log("Token:", token);

        // Em produção, você integraria com um serviço de email como:
        // - Resend
        // - SendGrid
        // - AWS SES
        // - NodeMailer
      },
      // Tempo de expiração do magic link (5 minutos)
      expiresIn: 60 * 5,
      // Permite que novos usuários se registrem via magic link
      disableSignUp: false,
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // 1 dia
  },
  trustedOrigins: ["http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;