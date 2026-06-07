import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Hardcoded users for MVP
const mockUsers = [
  {
    id: 'u1000000-0000-0000-0000-000000000001',
    name: 'Andi Pratama',
    email: 'andi@na-petcare.com',
    password: 'password123',
    role: 'na'
  },
  {
    id: 'u1000000-0000-0000-0000-000000000002',
    name: 'Siti Rahayu',
    email: 'siti@na-petcare.com',
    password: 'password123',
    role: 'na'
  }
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = mockUsers.find(u => u.email === credentials.email)
        if (!user || user.password !== credentials.password) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret-key-for-local-development-only-123',
}
