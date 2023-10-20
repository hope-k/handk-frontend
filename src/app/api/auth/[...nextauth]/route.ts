import NextAuth from "next-auth"
import type { User, Account, Profile, Awaitable, Session } from "next-auth"
import type { NextApiRequest, NextApiResponse } from "next"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

type Credentials = {
    email: string;
    password: string;
}

type GoogleTProfile = {
    id: string;
    email: string;
    sub: string;
    aud: string;
    email_verified: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

type TUser = Session["user"]


const handler = NextAuth({
    useSecureCookies: process.env.NODE_ENV == 'production',
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const { email, password } = credentials as Credentials
                const creds = {
                    email,
                    password
                }
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(creds)
                })
                const result = await res.json()

                if (res.ok === false) {
                    throw new Error(result.errors[0].detail)
                } else {
                    const user = {
                        access_token: result.access,
                        refresh_token: result.refresh,
                        ...result.user
                    }
                    return Promise.resolve(user)
                }
            }
        }),
        GoogleProvider({
            name: 'Google',
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),


    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user, account, profile }) {
            const profileData = profile as GoogleTProfile
            if (user) token.user = user
            if (account?.provider === 'google') {
                const oauthUser = {
                    'first_name': profileData?.given_name,
                    'last_name': profileData?.family_name,
                    'email': profileData?.email,
                    'provider': 'google',
                    'username': profileData?.name,
                    'avatar': profileData?.picture,
                    'email_verified': profileData?.email_verified,
                    'aud': profileData?.aud,
                }
                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/`, oauthUser);
                    const data = response.data;
                    token.user = data;
                } catch (error: any) {
                    // Handle the error here and display it on the frontend
                    const errorMessage = `Error occurred while authenticating with Google: ${error.response.data.type}`;
                    throw new Error(errorMessage);
                }
            }

            return Promise.resolve(token)
        },
        session({ session, token, user }) {
            session.user = token.user as TUser

            return Promise.resolve(session)
        },

    },
    events: {},
    debug: false
})


export { handler as GET, handler as POST }

