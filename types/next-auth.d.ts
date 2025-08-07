import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    isAdmin?: boolean
    emailVerified?: boolean
  }

  interface Session {
    user: {
      id: string
      isAdmin: boolean
      emailVerified: boolean
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean
    emailVerified?: boolean
  }
}