import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

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
        try {
          // Log para depuração
          console.log("Enviando magic link para:", email);
          console.log("URL:", url);

          const mailHost = process.env.MAIL_HOST;
          const mailPort = parseInt(process.env.MAIL_PORT || "465");
          const mailUser = process.env.MAIL_USER;
          const mailPassword = process.env.MAIL_PASSWORD;
          const fromEmail = process.env.MAIL_USER || "no-reply@lavive.com.br";

          // Template HTML do e-mail
          const emailHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu link de acesso ao LaviPloo</title>
  <style type="text/css">
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    table {
      border-collapse: collapse;
    }
    a {
      text-decoration: none;
    }
    .button-link {
      display: inline-block;
      background-color: #e46d8b;
      color: #fff;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
    }
    .button-link:hover {
      background-color: #f43f5e !important;
    }
    /* Estilos para o link alternativo */
    .link-alt a {
      color: #e46d8b !important;
      text-decoration: underline !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #fff1f2; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px; text-align: center;">

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 24px; font-weight: bold;">
                      <span style="color: #e46d8b;">Lavi</span><span style="color: #7e22ce;">Ploo</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <h1 style="font-size: 24px; font-weight: 600; color: #1f2937; margin: 0; padding: 0;">Seu link de acesso</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 10px 0 30px;">
                    <p style="color: #6b7280; font-size: 16px; margin: 0; padding: 0;">Clique no botão abaixo para acessar sua conta</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${url}" class="button-link" style="color: #fff; background-color: #e46d8b; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Acessar minha conta</a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                <tr>
                  <td align="left" style="word-break: break-all; color: #333; font-size: 14px; padding: 10px; background-color: #f3f4f6; border-radius: 4px;">
                    <strong>Link alternativo:</strong><br>
                    <a href="${url}" style="color: #e46d8b; word-break: break-all;">${url}</a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                <tr>
                  <td align="left" style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 4px; padding: 12px; font-size: 14px; color: #92400e;">
                    <strong>Importante:</strong> Este link expira em 5 minutos por motivos de segurança. Se você não solicitou este acesso, por favor ignore este e-mail.
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px; border-top: 1px solid #e5e7eb;">
                <tr>
                  <td align="center" style="padding-top: 20px; font-size: 14px; color: #6b7280;">
                    <p style="margin: 0 0 5px;">Este e-mail foi enviado para ${email}</p>
                    <p style="margin: 0;">© 2024 LaviPloo. Todos os direitos reservados.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
  
</body>
</html>`;

          // Configurar o transporter do Nodemailer
          const transporter = nodemailer.createTransport({
            host: mailHost,
            port: mailPort,
            secure: mailPort === 465, // true para porta 465, false para outras
            auth: {
              user: mailUser,
              pass: mailPassword,
            },
          });

          // Enviar o e-mail usando o Nodemailer
          const info = await transporter.sendMail({
            from: `LaviPloo <${fromEmail}>`,
            to: email,
            subject: "Seu link de acesso ao LaviPloo",
            html: emailHtml,
          });

          console.log("E-mail enviado com sucesso:", info.messageId);
        } catch (error) {
          console.error("Erro inesperado ao enviar magic link:", error);
          throw error;
        }
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
