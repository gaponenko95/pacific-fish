'use server';

import { redirect } from 'next/navigation';
import { signOut } from '@/shared/lib/auth';

export async function logout() {
	await signOut({ redirect: false });
	redirect('/admin');
}
