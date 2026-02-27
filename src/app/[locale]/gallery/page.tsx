import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import styles from '../page.module.css';

export default async function GalleryPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <GalleryContent />;
}

function GalleryContent() {
	const t = useTranslations('GalleryPage');

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<h1>{t('title')}</h1>
				<p>{t('description')}</p>
			</main>
		</div>
	);
}
