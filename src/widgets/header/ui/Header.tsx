import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LocaleSwitcher } from '@/features/locale-switcher/ui/LocaleSwitcher';
import styles from './Header.module.css';

const navLinks = [
	{ href: '/', key: 'home' },
	{ href: '/gallery', key: 'gallery' },
	{ href: '/products', key: 'products' },
	{ href: '/news', key: 'news' },
	{ href: '/contacts', key: 'contacts' },
] as const;

export function Header() {
	const t = useTranslations('Navigation');

	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<ul className={styles['nav-list']}>
					{navLinks.map(({ href, key }) => (
						<li key={key}>
							<Link href={href} className={styles['nav-link']}>
								{t(key)}
							</Link>
						</li>
					))}
				</ul>
				<LocaleSwitcher />
			</nav>
		</header>
	);
}
