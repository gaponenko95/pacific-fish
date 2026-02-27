import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import './auth.types';

export const { auth, handlers, signIn, signOut } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				email: {},
				password: {},
			},
			async authorize(credentials) {
				const email = credentials.email as string;
				const password = credentials.password as string;

				if (!email || !password) return null;

				const user = await prisma.user.findUnique({ where: { email } });
				if (!user) return null;

				const isValid = await compare(password, user.passwordHash);
				if (!isValid) return null;

				return {
					id: String(user.id),
					name: user.name,
					email: user.email,
					role: user.role,
				};
			},
		}),
	],
	session: { strategy: 'jwt' },
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id!;
				token.role = user.role;
			}
			return token;
		},
		session({ session, token }) {
			session.user.id = token.id;
			session.user.role = token.role;
			return session;
		},
	},
});
