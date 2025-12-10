//auth.ts (v5/ Auth.js)
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { compareSync } from "bcrypt-ts-edge";
import Credentials from "next-auth/providers/credentials";
import { mergeSessionCartToUser } from "./lib/actions/cart/merge-session-carts";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
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
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        // Normalize incoming email and find user in database (case-insensitive)
        const lookupEmail = String(credentials.email).trim();
        const user = await prisma.user.findFirst({
          where: { email: { equals: lookupEmail, mode: "insensitive" } },
        });

        if (!user || !user.password) return null;

        // Ensure values are strings for compareSync
        const plainPassword = String(credentials.password);
        const hashedPassword = String(user.password);

        // Check if Password matches
        const isMatch = compareSync(plainPassword, hashedPassword);
        if (!isMatch) return null;

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Email Not Verified");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        // Narrow token shape without using `any`
        type TokenWithRole = { role?: string; name?: string } & Record<
          string,
          unknown
        >;
        const t = token as TokenWithRole;
        (session.user as { role?: string }).role = t.role;
        session.user.name = t.name as string;
      }
      return session;
    },

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      try {
        // On sign in, copy user properties to the token
        if (user) {
          token.id = user.id;
          token.role = user.role;

          // fallback name if it's not set
          if (user.name === "NO_NAME") {
            token.name = user.email?.split("@")[0];
          }

          // reflect token name to DB (only when user exist)
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name as string },
          });

          // merge session cart to user cart on sign in/up
          if (trigger === "signIn" || trigger === "signUp") {
            await mergeSessionCartToUser(user.id);
          }
        }

        // allow username updates
        if (trigger === "update" && session?.user.name) {
          token.name = session.user.name;
        }
      } catch (error) {
        console.error("[🔥 JWT ERROR]", error);
      }
      return token;
    },

    // Leave authorization to middleware; always return true
    authorized() {
      return true;
    },
  },
});
