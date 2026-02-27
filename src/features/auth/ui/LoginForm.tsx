'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import styles from './LoginForm.module.css';

export function LoginForm() {
	const { update } = useSession();
	const [error, setError] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setIsPending(true);

		const formData = new FormData(e.currentTarget);

		const result = await signIn('credentials', {
			email: formData.get('email'),
			password: formData.get('password'),
			redirect: false,
		});

		if (result?.error) {
			setError('Неверный email или пароль');
			setIsPending(false);
			return;
		}

		await update();
	}

	return (
		<div className={styles.page}>
			<form onSubmit={handleSubmit} className={styles.card}>
				<h1 className={styles.title}>Pacific Fish</h1>
				<p className={styles.subtitle}>Панель управления</p>

				{error && <div className={styles.error}>{error}</div>}

				<div className={styles.field}>
					<label htmlFor="email" className={styles.label}>
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						autoComplete="email"
						className={styles.input}
					/>
				</div>

				<div className={styles.field}>
					<label htmlFor="password" className={styles.label}>
						Пароль
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						autoComplete="current-password"
						className={styles.input}
					/>
				</div>

				<button type="submit" disabled={isPending} className={styles.button}>
					{isPending ? 'Вход...' : 'Войти'}
				</button>
			</form>
		</div>
	);
}
