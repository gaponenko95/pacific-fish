import { PrismaClient, GalleryCategory } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	// ─── Admin User ─────────────────────────────────────
	await prisma.user.upsert({
		where: { email: 'admin@pacific-fish.ru' },
		update: {},
		create: {
			email: 'admin@pacific-fish.ru',
			passwordHash: hashSync('admin123', 10),
			name: 'Администратор',
			role: 'ADMIN',
		},
	});

	// ─── Suppliers ───────────────────────────────────────
	const suppliers = await Promise.all(
		[
			'Меридиан',
			'Дружба',
			'Волна',
			'Тунайча',
			'РК им. Кирова',
			'Мираж',
			'Грин Стар',
		].map((name, i) =>
			prisma.supplier.create({ data: { name, order: i + 1 } }),
		),
	);

	// ─── Products + Stock ───────────────────────────────
	const products = [
		{
			nameRu: 'Кета БГ С0',
			nameEn: 'Chum salmon without head, C0',
			nameZh: '去头大马哈鱼 C0',
			category: 'fish',
			price: 240.0,
		},
		{
			nameRu: 'Кета БГ С1',
			nameEn: 'Chum salmon without head, C1',
			nameZh: '去头大马哈鱼 C1',
			category: 'fish',
			price: 290.0,
		},
		{
			nameRu: 'Кета БГ С2',
			nameEn: 'Chum salmon without head, C2',
			nameZh: '去头大马哈鱼 C2',
			category: 'fish',
			price: 390.0,
		},
		{
			nameRu: 'Морская капуста',
			nameEn: 'Laminaria',
			nameZh: '海带',
			category: 'seafood',
			price: 45.0,
		},
		{
			nameRu: 'Терпуг',
			nameEn: 'Greenling (mackerel)',
			nameZh: '六线鱼',
			category: 'fish',
			price: 240.0,
		},
		{
			nameRu: 'Икра мороженная',
			nameEn: 'Frozen caviar',
			nameZh: '冷冻鱼子酱',
			category: 'caviar',
			price: 4600.0,
		},
	];

	for (let i = 0; i < products.length; i++) {
		const p = products[i];
		const product = await prisma.product.create({
			data: {
				nameRu: p.nameRu,
				nameEn: p.nameEn,
				nameZh: p.nameZh,
				category: p.category,
				price: p.price,
				order: i + 1,
			},
		});

		// Create stock entries (all 0 kg, matching old project)
		await prisma.productStock.createMany({
			data: suppliers.map((s) => ({
				productId: product.id,
				supplierId: s.id,
				weightKg: 0,
			})),
		});
	}

	// ─── News ───────────────────────────────────────────
	const newsData = [
		{
			slug: 'global-fishery-forum-2023',
			featured: true,
			publishedAt: new Date('2023-10-01'),
			titleRu: 'Global fishery forum and Seafood expo Russia',
			titleEn: 'Global fishery forum and Seafood expo Russia',
			titleZh: '全球渔业论坛和海鲜博览会俄罗斯2023',
			descriptionRu:
				'Ежегодная. Рыбная. Твоя – выставка, на которую каждую осень собираются 350 компаний из 17 стран мира и 35 регионов России! ...',
			descriptionEn:
				'Annual. Fishery. Yours  - its our exhibition where 350 companies from 17 countries and 35 regions of Russia gather every autumn! ...',
			descriptionZh:
				'年度。 渔业。 你的-这是我们的展览, 每年秋天来自俄罗斯17个国家和35个地区的350家公司聚集在一起! ...',
			contentRu:
				'Ежегодная. Рыбная. Твоя – выставка, на которую каждую осень собираются 350 компаний из 17 стран мира, и 35 регионов России! И наша команда уже в 7 раз приезжает в Петербург для поддержания деловых и дружеских контактов, поиска новых клиентов среди российских и иностранных компаний, и проведение личных встреч с партнерами, которых знаем только онлайн – ведь именно это главные цели Форума! В этому году Организаторы поразили нас высоким уровнем организованности и размахом – два павильона, наполненные разнообразными и масштабными стендами, которые радуют глаз дизайнерскими решениями!',
			contentEn:
				'Annual. Fishery. Yours  - its our exhibition where 350 companies from 17 countries and 35 regions of Russia gather every autumn! And our team has been coming to St. Petersburg for the 7th time to maintain business and friendly contacts, search for new clients among Russian and foreign companies, and hold personal meetings with partners we know only online – after all, these are the main goals of the Forum! This year, the Organizers impressed us with a high level of organization and scope – two pavilions filled with diverse and large-scale stands that delight the eye with design solutions! We thank our partners for meeting in a warm circle, the organizers for the opportunity, and new customers for their trust!',
			contentZh:
				'年度。 渔业。 你的-这是我们的展览, 每年秋天来自俄罗斯17个国家和35个地区的350家公司聚集在一起! 我们的团队第七次来到圣彼得堡，以保持业务和友好的联系，在俄罗斯和外国公司中寻找新客户，并与我们只在网上认识的合作伙伴举行个人会议--毕竟，这些是论坛的主要目标！今年，组织者以高水平的组织和范围给我们留下了深刻的印象-两个展馆充满了多样化和大型的看台，以设计解决方案取悦眼球！我们感谢合作伙伴在温暖的圈子里见面，感谢主办方的机会，感谢新客户的信任！',
			thumbnailUrl: '/images/news/5/1-min.webp',
			images: [
				'/images/news/5/3.webp',
				'/images/news/5/1.webp',
				'/images/news/5/2.webp',
			],
		},
		{
			slug: 'tyl-frontu',
			featured: false,
			publishedAt: new Date('2023-08-01'),
			titleRu: 'ТЫЛ - ФРОНТУ',
			titleEn: 'Our support to the front',
			titleZh: '我们支援前线',
			descriptionRu:
				'Потому что все ребята на передовой НАШИ. И с самого начала СВО наша компания поддерживает 3ю мотострелковую дивизию ...',
			descriptionEn:
				'Because all the guys at the frontline ARE LIKE FAMILY. Since the very beginning of the special military operation our company ...',
			descriptionZh:
				'因为我们的孩子都在前线。从一开始，我们公司就积极支持位于前线的第三摩托化步兵师。...',
			contentRu:
				'Потому что все ребята на передовой НАШИ. И с самого начала СВО наша компания активно поддерживает 3ю мотострелковую дивизию, расположенную в городе В. С помощью добровольцев Е. и Д., а также лейтенанту с позывным «Демон», мы узнаем о нуждах ребят на фронте, и сразу включаемся в работу. Е. ведет телеграм – каналы  «Поможем фронту!» и «Два майора», и они с братом ездят «за ленточку», чтобы лично передать посылки ребятам, а с фронта приходят видео- благодарности всем, кто им помогает, и достает то, что достать практически невозможно! И мы горды быть в этом списке. Все для Победы!',
			contentEn:
				"Because all the guys at the frontline ARE LIKE FAMILY. Since the very beginning of the special military operation our company has been actively supporting the 3rd Motorized Rifle Division, located in the city of V. The volunteers E. and D. as well as the lieutenant with the call sigh Demon inform us about the needs of our soldiers and we immediately join in the work. E. hosts the telegram channels Let's help the front! and Two majors, and together with his brother the volunteers go to the front lines to personally hand over the parcels to our boys and bring back videos where the latter wholeheartedly thank everyone who has been helping them and has been getting them what seems almost impossible to get! And we're proud to be on that list. Everything for the Victory!",
			contentZh:
				'因为我们的孩子都在前线。从一开始，我们公司就积极支持位于前线的第三摩托化步兵师。在志愿者的帮助下，我们了解了前线孩子们的需求，并立即投入工作。"我们将帮助前线！","两个少校"，"他和他的兄弟骑着丝带"等频道亲自把包裹交给孩子们，从前线来了视频。感谢所有帮助他们的人，我们得到了几乎不可能得到的东西！我们很自豪能在这个名单上。一切为了胜利!',
			thumbnailUrl: '/images/news/1/4.webp',
			images: ['/images/news/1/4.webp'],
		},
		{
			slug: 'subbotnik',
			featured: false,
			publishedAt: new Date('2023-05-15'),
			titleRu: 'Субботник – это добрая традиция!',
			titleEn: 'Subbotnik clean-ups are a good tradition!',
			titleZh: '周六志愿者，是个好传统!',
			descriptionRu:
				'Команда "Пасифик Фиш Ресорсес" - провела субботник на территории леса прилегающей к улице Горная в Южно - Сахалинске ...',
			descriptionEn:
				'The PACIFIC FISH RESORCES team has joined a subbotnik clean-up in the forest area in the Gornaya Street neighborhood in Yuzhno-Sakhalinsk ...',
			descriptionZh:
				'"太平洋渔业资源"团队星期六在萨哈林斯克南部山地大街附近的森林里进行了清理。...',
			contentRu:
				'Команда "Пасифик Фиш Ресорсес" - провела субботник на территории леса прилегающей к улице Горная в Южно - Сахалинске. Теплый майский четверг – непривычно теплое, а значит, подходящее для труда время! Работа до обеда, а там – брюки в носки, голову в кепку, и вперед – на определенный общественностью участок! Территория нам досталась обжитая маргинальным элементом, что сделало нашу работу на участке максимально заметной! Итого: 1 компания, 4 часа, 17 мешков мусора и два пойманных клеща! План выполнили, и настроение подняли – все же труд облагораживает!',
			contentEn:
				'The PACIFIC FISH RESORCES team has joined a subbotnik clean-up in the forest area in the Gornaya Street neighborhood in Yuzhno-Sakhalinsk. That Thursday in May was so unusually warm which is why it suited our purpose perfectly! We completed the work in the company by noon, equipped ourselves with appropriate clothing and headed to the area assigned to us by the city. This area appeared to have been badly littered, so the result of our work caught the eye! To sum up: it took our team 4 hours to collect 17 bags of rubbish and to catch two ticks! There is definitely dignity in work: not only did we carry out the plan, but it also lifted our spirits!',
			contentZh:
				'"太平洋渔业资源"团队星期六在萨哈林斯克南部山地大街附近的森林里进行了清理。温暖的五月星期四-不寻常的温暖，这意味着一个工作的好时机！我们工作到中午，袜子塞进裤腿，戴着帽子，然后继续-工作在公共区域！我们的区域遍布垃圾，这使得我们在现场的工作尽可能引人注目！总共：1个公司，4小时，17袋垃圾和两个被抓的蜱！计划完成了，心情也提高了——但劳动使人高尚！',
			thumbnailUrl: '/images/news/2/1-min.webp',
			images: [
				'/images/news/2/1.webp',
				'/images/news/2/2.webp',
				'/images/news/2/3.webp',
			],
		},
		{
			slug: 'den-rybaka',
			featured: false,
			publishedAt: new Date('2023-07-06'),
			titleRu: 'День рыбака',
			titleEn: "Fisherman's Day",
			titleZh: '渔夫节',
			descriptionRu:
				'6 июля наш небольшой, но дружный, коллектив собрался за чашкой тортика по важному поводу – канун Дня рыбака ...',
			descriptionEn:
				'The 6th of July happened to be an occasion important enough to bring our small and friendly team together and to celebrate  ...',
			descriptionZh:
				'7月6日，我们的小而友好的团队聚集在一起，在这个重要的节日吃蛋糕——渔夫节前夕，...',
			contentRu:
				'6 июля наш небольшой, но дружный, коллектив собрался за чашкой тортика по важному поводу – канун Дня рыбака, в Сахалинской области эту дату точно можно отмечать красным в календаре! Ведь в этот день мы поздравляем всех, кто связан с рыбой, рыбалкой и рыболовством, а на острове, чьи очертания четко напоминают то самое водное животное, с Днем рыбака можно поздравить каждого второго, а то и первого жителя! А впереди теплые выходные, которые островитяне проведут на пляжах и парках, где в каждом районе для них подготовлены праздничные мероприятия!',
			contentEn:
				"The 6th of July happened to be an occasion important enough to bring our small and friendly team together and to celebrate it with aromatic tea and delicious cake – it was no more and no less but the eve of Fisherman's Day, a significant date for the whole Sakhalin region! On the island, where more than a half of the population works with fish or in fishing or has it as a favourite pass-time activity, Fisherman's Day is to be a special occasion. After all, even the shape of the island resembles this marine creature! The fact that we still had warm weekend ahead of us, which we as well as other islanders would spend on beaches and in parks taking part in various festive events, specifically prepared in each district, made us feel even better!",
			contentZh:
				'7月6日，我们的小而友好的团队聚集在一起，在这个重要的节日吃蛋糕——渔夫节前夕，萨哈林地区的这个日子可以在日历上用红色标记！ 毕竟，在这一天，我们祝贺所有与鱼，钓鱼和捕鱼有关的人，在一个岛上，它的形状与水生动物非常相似，你可以祝贺每两个甚至第一个居民中的一个。接下来是一个温暖的周末，岛民将在海滩和公园度过，每个地区都为他们准备了节日活动！',
			thumbnailUrl: '/images/news/4/1-min.webp',
			images: [
				'/images/news/4/1.webp',
				'/images/news/4/2.webp',
				'/images/news/4/3.webp',
			],
		},
		{
			slug: 'polnaya-gotovnost-putina',
			featured: false,
			publishedAt: new Date('2023-07-01'),
			titleRu: 'Полная готовность!',
			titleEn: 'Completely ready!',
			titleZh: '准备好了!',
			descriptionRu:
				'1 июля – официальный старт главной путины года, лососёвой. Горбуша, кета, нерка, кижуч – слова, приятные уху каждого ...',
			descriptionEn:
				'July the 1st marks the official start of the main fishing season of the year, the one of salmonids. Pink salmon, chum salmon ...',
			descriptionZh:
				'7月1日-年度捕捞季主要活动"鲑鱼"正式开幕。大麻哈鱼、鲑鱼、红鳟、...',
			contentRu:
				'1 июля – официальный старт главной путины года, лососёвой. Горбуша, кета, нерка, кижуч – слова, приятные уху каждого дальневосточника! И аж до 30 сентября местные рыбопромышленники будут направлять все свои мощности на это рыбное семейство, а после – радовать свежей рыбкой всю страну и дружественные страны Азиатско – Тихоокеанского региона.',
			contentEn:
				'July the 1st marks the official start of the main fishing season of the year, the one of salmonids. Pink salmon, chum salmon, sockeye salmon, coho salmon – these are the words that everyone in the Far Easterner is so happy to hear! Up to September the 30th local fishermen will direct all their productive capacities to catch as many salmonids as they possibly can to later please the whole country and friendly countries of the Asia Pacific region with fresh fish.',
			contentZh:
				'7月1日-年度捕捞季主要活动"鲑鱼"正式开幕。 大麻哈鱼、鲑鱼、红鳟、银鳟——每个远东人耳边都有祝福的话！直到9月30日，当地渔业企业将把所有的生产能力都集中在鱼群上，之后将为整个国家和友好的亚太国家提供新鲜的鱼。',
			thumbnailUrl: '/images/news/3/1-min.webp',
			images: [
				'/images/news/3/1.webp',
				'/images/news/3/2.webp',
				'/images/news/3/3.webp',
			],
		},
	];

	for (const n of newsData) {
		await prisma.news.create({
			data: {
				slug: n.slug,
				featured: n.featured,
				publishedAt: n.publishedAt,
				titleRu: n.titleRu,
				titleEn: n.titleEn,
				titleZh: n.titleZh,
				descriptionRu: n.descriptionRu,
				descriptionEn: n.descriptionEn,
				descriptionZh: n.descriptionZh,
				contentRu: n.contentRu,
				contentEn: n.contentEn,
				contentZh: n.contentZh,
				thumbnailUrl: n.thumbnailUrl,
				images: {
					create: n.images.map((url, i) => ({ url, order: i + 1 })),
				},
			},
		});
	}

	// ─── Partners ───────────────────────────────────────
	for (let i = 1; i <= 8; i++) {
		await prisma.partner.create({
			data: {
				name: `Partner ${i}`,
				logoUrl: `/images/partners/${i}-min.webp`,
				order: i,
			},
		});
	}

	// ─── Gallery: Fish ──────────────────────────────────
	for (let i = 1; i <= 12; i++) {
		await prisma.galleryImage.create({
			data: {
				url: `/images/fish/${i}.webp`,
				category: GalleryCategory.FISH,
				order: i,
			},
		});
	}

	// ─── Gallery: Production ────────────────────────────
	const productionPhotos = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
		22, 23, 24, 25, 26, 27, 28,
	];
	for (let i = 0; i < productionPhotos.length; i++) {
		await prisma.galleryImage.create({
			data: {
				url: `/images/photo/${productionPhotos[i]}.webp`,
				category: GalleryCategory.PRODUCTION,
				order: i + 1,
			},
		});
	}

	// ─── Announcements ─────────────────────────────────
	await prisma.announcement.createMany({
		data: [
			{
				imageUrl: '/images/anonce/invitation-2025-cn.png',
				active: true,
				order: 1,
			},
			{
				imageUrl: '/images/anonce/adobe-scan.webp',
				active: true,
				order: 2,
			},
		],
	});

	// ─── Site Settings ─────────────────────────────────
	await prisma.siteSetting.createMany({
		data: [
			{
				key: 'contacts',
				value: {
					address: {
						ru: '693 012, Сахалинская область, город Южно-Сахалинск, проспект Мира, 1ж',
						en: '693 012, Sakhalin Oblast, Yuzhno-Sakhalinsk, Mira Ave, 1zh',
						zh: '693 012, 萨哈林州, 南萨哈林斯克, 和平大道 1ж',
					},
					phones: [
						'+7 (4242) 27-18-70',
						'+7 (4242) 55-65-67',
						'+7 (914) 757-18-70',
					],
					email: 'info@pacific-fish.ru',
					mapUrl: 'https://yandex.ru/maps/-/CCUWQCw2dC',
				},
			},
			{
				key: 'companyFeatures',
				value: {
					foundedYear: 2002,
					suppliersCount: '45+',
					warehouseTons: '850+',
					annualTons: '15000+',
					exportCountries: 11,
					coveredRegions: 50,
					partnerCompanies: '80+',
				},
			},
			{
				key: 'videoUrl',
				value: {
					url: 'https://rutube.ru/play/embed/6a2a775b1c77b58152dfca22fb2efa36/',
				},
			},
		],
	});

	console.log('Seed completed successfully');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
