import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from './db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();
        
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.nume,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
        await dbConnect();
        
        // Verificăm dacă utilizatorul există deja
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Creăm un utilizator nou pentru Google
          await User.create({
            nume: user.name,
            email: user.email,
              password: 'google-auth', // Marcăm că este cont Google
              provider: 'google',
            role: 'user', // Rol implicit pentru utilizatori noi
          });
            console.log('✅ Created new Google user:', user.email);
          } else {
            console.log('✅ Google user already exists:', user.email);
        }
        } catch (error) {
          console.error('❌ Error in Google signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // Pentru toți utilizatorii, verificăm și actualizăm rolul din baza de date
      if (token.email) {
        try {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
            token.role = dbUser.role;
            console.log('✅ Found user data for token:', { id: token.id, role: token.role });
        }
        } catch (error) {
          console.error('❌ Error finding user for token:', error);
        }
      }
      
      console.log('🔍 JWT token:', { id: token.id, role: token.role, email: token.email });
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      console.log('🔍 Session data:', { id: session.user.id, role: session.user.role, email: session.user.email });
      return session;
    },
  },
};