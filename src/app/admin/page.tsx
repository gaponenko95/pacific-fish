'use client';

import { signOut, useSession } from 'next-auth/react';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import styles from './page.module.css';

export default function AdminPage() {
	const { data: session, status, update } = useSession();

	if (status === 'loading') {
		return (
			<div className={styles.loading}>
				<p>Загрузка...</p>
			</div>
		);
	}

	if (!session) {
		return <LoginForm />;
	}

	async function handleLogout() {
		await signOut({ redirect: false });
		await update();
	}

	return (
		<div className={styles.page}>
			<h1>Добро пожаловать, {session.user?.name}!</h1>
			<p className={styles.subtitle}>Панель управления Pacific Fish</p>
			<div className={styles.logoutForm}>
				<button
					type="button"
					className={styles.logoutButton}
					onClick={handleLogout}
				>
					Выйти
				</button>
			</div>
		</div>
	);
}
