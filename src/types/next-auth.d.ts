
import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: number
            access_token: string
            refresh_token: string
            first_name: string
            last_name: string
            email: string
            provider: string
            avatar: string
            username: string
            email_verified: boolean
            is_active: boolean
            is_staff: boolean
            is_superuser: boolean
            date_joined: string
        }
    }
}