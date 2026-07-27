import { i18n } from "@better-auth/i18n";
import { createDb } from "@topsun/db";
import * as schema from "@topsun/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL ?? "";
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET ?? "";
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    advanced: {
      database: {
        generateId: false,
      },
    },
    baseURL: BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      admin(),
      i18n({
        defaultLocale: "pt-BR",
        translations: {
          "pt-BR": {
            CREDENTIAL_ACCOUNT_NOT_FOUND: "Conta de credencial não encontrada",
            EMAIL_NOT_VERIFIED: "Email não verificado",
            INVALID_EMAIL_OR_PASSWORD: "Email ou senha inválidos",
            INVALID_PASSWORD: "Senha inválida",
            SESSION_EXPIRED: "Sessão expirada",
            USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
              "Endereço de email já está em uso",
            USER_NOT_FOUND: "Usuário não encontrado",
          },
        },
      }),
      tanstackStartCookies(),
    ],
    secret: BETTER_AUTH_SECRET,
    trustedOrigins: [CORS_ORIGIN],
  });
}

export const auth = createAuth();
