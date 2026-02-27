'use client';

import { useActionState } from 'react';
import { authenticate } from '@/features/auth/actions/authenticate';
import styles from './LoginForm.module.css';

export function LoginForm() {
	const [error, formAction, isPending] = useActionState(authenticate, null);

	return (
		<div className={styles.page}>
			<form action={formAction} className={styles.card}>
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
