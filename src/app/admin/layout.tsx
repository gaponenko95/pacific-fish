import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Pacific Fish — Администрирование',
};

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body>{children}</body>
		</html>
	);
}
