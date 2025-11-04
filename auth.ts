import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
// import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
        token.id = user.id;
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

        if (trigger === "signIn" || trigger === "signUp") {
          const cookieObj = await cookies();
          const sessionCartId = cookieObj.get("session_cartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId: sessionCartId },
            });

            if (sessionCart) {
              // Delete current user cart
              await prisma.cart.deleteMany({
                where: {
                  userId: user.id,
                },
              });
              // Assign new cart to user
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      //Handle session update
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      // Array of protected routes
      const protectedPath = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // Get pathname for url object
      const { pathname } = request.nextUrl;
      console.log(pathname);

      // Check if user is not authenticated and accessing a protected path.
      const isAuthenticated = !!(auth && auth.user);
      if (!isAuthenticated && protectedPath.some((p) => p.test(pathname))) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      // Check for session cart cookie
      if (!request.cookies.get("session_cartId")) {
        //Generate a new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        //Clone the req headers
        const newRequestHeaders = new Headers(request.headers);

        //Create new response and add the new headers
        const response = NextResponse.next({
          request: { headers: newRequestHeaders },
        });

        //Set the cookie in the response
        response.cookies.set({
          name: "session_cartId",
          value: sessionCartId,
          httpOnly: true,
        });
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
