import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            /** The user's Google ID. */
            googleId?: string
        } & DefaultSession["user"]
    }
}
