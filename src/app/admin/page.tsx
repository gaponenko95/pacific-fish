import { auth } from '@/shared/lib/auth';
import { logout } from '@/features/auth/actions/logout';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import styles from './page.module.css';

export default async function AdminPage() {
	const session = await auth();

	if (!session) {
		return <LoginForm />;
	}

	return (
		<div className={styles.page}>
			<h1>Добро пожаловать, {session.user?.name}!</h1>
			<p className={styles.subtitle}>Панель управления Pacific Fish</p>
			<form action={logout} className={styles.logoutForm}>
				<button type="submit" className={styles.logoutButton}>
					Выйти
				</button>
			</form>
		</div>
	);
}
