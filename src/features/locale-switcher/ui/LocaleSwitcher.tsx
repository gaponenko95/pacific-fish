'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/shared/config/i18n';

export function LocaleSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const t = useTranslations('LocaleSwitcher');

	function handleChange(newLocale: string) {
		const segments = pathname.split('/');
		segments[1] = newLocale;
		router.replace(segments.join('/'));
	}

	return (
		<div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
			{locales.map((loc) => (
				<button
					key={loc}
					onClick={() => handleChange(loc)}
					disabled={loc === locale}
					style={{
						padding: '0.5rem 1rem',
						cursor: loc === locale ? 'default' : 'pointer',
						opacity: loc === locale ? 0.5 : 1,
					}}
				>
					{t(loc)}
				</button>
			))}
		</div>
	);
}
