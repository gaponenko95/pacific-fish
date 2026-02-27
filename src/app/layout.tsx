import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Pacific Fish',
	description: 'Pacific Fish — официальный сайт',
};

export default function RootLayout({
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
