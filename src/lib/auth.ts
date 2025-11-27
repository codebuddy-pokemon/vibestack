import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"

export const authOptions = {
    // Don't use adapter with CredentialsProvider
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt" as const,
    },
    providers: [
        CredentialsProvider({
            name: "Dev Login",
            credentials: {
                name: { label: "Name", type: "text", placeholder: "John Doe" },
                email: { label: "Email", type: "text", placeholder: "dev@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Create or return a dummy user - ENABLED FOR PRODUCTION LOGIN
                // if (process.env.NODE_ENV === "development") {
                const user = await prisma.user.upsert({
                    where: { email: credentials?.email || "dev@example.com" },
                    update: {},
                    create: {
                        email: credentials?.email || "dev@example.com",
                        name: credentials?.name || "Dev User",
                        image: "https://github.com/shadcn.png",
                    },
                })
                return user
                // }
                // return null
            }
        }),
        // Note: OAuth and Email providers require PrismaAdapter
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id
                token.email = user.email
            }
            return token
        },
        async session({ session, token }: any) {
            if (session?.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.plan = 'FREE'
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
        // signOut: '/auth/signout',
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
}

export const handler = NextAuth(authOptions)
