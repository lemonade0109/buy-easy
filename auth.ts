import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { CallBackProps } from "@/types";
import { JWT } from "next-auth/jwt";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        //Find user in database
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        // Check if user exists and if Password matches
        if (user && user.password) {
          const isPasswordCorrect = compareSync(
            credentials.password as string,
            user.password
          );
          if (isPasswordCorrect) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        }

        //If user does not exist or password is incorrect return null
        return null;
      },
    }),
  ],
  callbacks: {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.name = token.name;
      }

      // If there is an update, set the username
      if (trigger === "update" && user && session.user) {
        session.user.name = user.name;
      }

      return session;
    },

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.role = user.role;

        //IF user has no name then use the email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];
        }

        //Update database to reflect the token name
        await prisma.user.update({
          where: { id: user.id },
          data: { name: token.name },
        });
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
