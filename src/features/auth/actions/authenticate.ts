'use server';

import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/shared/lib/auth';

export async function authenticate(
	_prevState: string | null,
	formData: FormData,
): Promise<string | null> {
	try {
		await signIn('credentials', {
			email: formData.get('email'),
			password: formData.get('password'),
			redirect: false,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			return 'Неверный email или пароль';
		}
		throw error;
	}
	redirect('/admin');
}
