'use server';

import { signOut } from '@/shared/lib/auth';

export async function logout() {
	await signOut({ redirectTo: '/admin' });
}
