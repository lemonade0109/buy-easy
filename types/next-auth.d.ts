import { DefaultSession } from "next-auth";

// Extend the Session interface to include a role property
declare module "next-auth" {
  export interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}
