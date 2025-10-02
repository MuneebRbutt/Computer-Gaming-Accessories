import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { UserRecord, findUserByEmail } from "./users";

// Types for better type safety
interface ExtendedUser extends User {
  id: string;
}

// Utility function to get environment variables with fallbacks
const getEnvVars = () => {
  return {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  };
};

// Get environment variables
const env = getEnvVars();

export const authOptions: NextAuthOptions = {
  providers: [
    // Only include Google provider if credentials are provided
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      })
    ] : []),
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        try {
          // Validate input
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(credentials.email)) {
            console.log("Invalid email format");
            return null;
          }

          // Find user
          const user = findUserByEmail(credentials.email);
          if (!user) {
            console.log("User not found");
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
          }

          // Return user object
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=0ea5e9&color=fff&size=128`,
            role: user.role,
          } as ExtendedUser;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    newUser: "/signup",
    verifyRequest: "/verify-request",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      
      // Handle OAuth account linking
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).provider = token.provider as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // Allow all OAuth sign-ins
        if (account?.provider === "google") {
          return true;
        }

        // Allow credentials sign-in if user exists
        if (account?.provider === "credentials") {
          return !!user;
        }

        return false;
      } catch (error) {
        console.error("Sign in callback error:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: env.NEXTAUTH_SECRET || "your-fallback-secret-key-change-in-production",
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error(`NextAuth Error [${code}]:`, metadata);
    },
    warn(code) {
      console.warn(`NextAuth Warning [${code}]`);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.log(`NextAuth Debug [${code}]:`, metadata);
      }
    },
  },
};