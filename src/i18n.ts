// The two languages of the site. English lives at the root, French under /fr/.
// Essays are written in one language only; everything around them is in both.
export type Lang = 'en' | 'fr';
export const langs: Lang[] = ['en', 'fr'];

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// Path without the base and without the /fr prefix.
export const bare = (pathname: string) => {
  const p = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return p.replace(/^\/fr(?=\/|$)/, '') || '/';
};
export const langOf = (pathname: string): Lang => {
  const p = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return /^\/fr(\/|$)/.test(p) ? 'fr' : 'en';
};
// Internal link in the given language.
export const lp = (lang: Lang, path: string) => `${base}${lang === 'fr' ? '/fr' : ''}${path}`;
// For getStaticPaths of pages under src/pages/[...lang]/.
export const langPaths = () => [{ params: { lang: undefined } }, { params: { lang: 'fr' } }];

// The fields the work is filed under, each with, under the title of its page,
// a fact or a short quotation and who said it: taken from the thesis for the
// four fields, from Simondon for philosophy.
// Philosophy comes after the four, set apart and in red: it looks at the
// whole rather than at a part.
export const themes = [
  {
    id: 'history', en: 'History', fr: 'Histoire',
    // The motto of the Paris-Lyon-Méditerranée railway's accounts, thesis ch. 1 (mechanised data).
    line: { en: '“First organise, then mechanise.”', fr: '« D’abord organiser, ensuite mécaniser. »' },
    by: { en: 'Georges Bolle, head of accounts of the PLM railway, 1929', fr: 'Georges Bolle, chef de la comptabilité du PLM, 1929' },
  },
  {
    id: 'economics', en: 'Economics', fr: 'Économie',
    // The epigraph of thesis ch. 2; the French is the thesis's own translation.
    line: { en: '“It is unworthy of excellent men to lose hours like slaves in the labor of calculation, which could be safely relegated to anyone else if the machine were used.”', fr: '« Il est indigne d’hommes éminents de perdre des heures, comme des esclaves, au labeur du calcul, qui pourrait être confié en toute sûreté au premier venu si l’on employait la machine. »' },
    by: { en: 'Leibniz, 1685, translated by Mark Kormes', fr: 'Leibniz, 1685' },
  },
  {
    id: 'biophysics', en: 'Biophysics', fr: 'Biophysique',
    // Thesis ch. 3, after Daumas, Histoire générale des techniques, p. 296.
    line: { en: 'The watch is “a machine with zero efficiency”: “it is not work that is asked of it, but information.”', fr: 'La montre est « une machine à rendement nul » : « ce n’est pas du travail qu’on lui demande, mais de l’information ».' },
    by: { en: 'Maurice Daumas, 1964', fr: 'Maurice Daumas, 1964' },
  },
  {
    id: 'climate', en: 'Climate', fr: 'Climat',
    // Thesis ch. 3, on the IPCC's sixth assessment report.
    line: { en: 'Mean surface temperature has risen by about 1.1 °C above the pre-industrial period. The attribution of this warming to human greenhouse gas emissions is called “unequivocal”.', fr: 'La température moyenne de surface a augmenté d’environ 1,1 °C par rapport à la période préindustrielle. L’attribution de ce réchauffement aux émissions anthropiques de gaz à effet de serre est qualifiée de « sans équivoque ».' },
    by: { en: 'IPCC, Sixth Assessment Report, 2021', fr: 'GIEC, sixième rapport d’évaluation, 2021' },
  },
  {
    id: 'philosophy', en: 'Philosophy', fr: 'Philosophie', apart: true,
    // Simondon, Du mode d'existence des objets techniques, Aubier, introduction, p. 12.
    line: { en: '“What resides in machines is human reality, human gesture fixed and crystallised in structures that work.”', fr: '« Ce qui réside dans les machines, c’est de la réalité humaine, du geste humain fixé et cristallisé en structures qui fonctionnent. »' },
    by: { en: 'Gilbert Simondon, 1958', fr: 'Gilbert Simondon, 1958' },
  },
] as const;
export type ThemeId = (typeof themes)[number]['id'];

export const ui = {
  en: {
    title: 'Information, energy and ecology',
    description: 'Articles, essays and research projects by Rémi Paccou on information, energy and ecology.',
    // The large title of the home page: the core of the research, in one sentence.
    heading: 'Exploring the patterns of information across nature and society',
    articles: 'Papers', essays: 'Essays', projects: 'Projects', research: 'Research', books: 'Book', fields: 'Fields', talks: 'Talks', about: 'About',
    notices: 'Notices', themes: 'Fields', follow: 'Follow', more: 'More', rss: 'RSS feed',
    readEssay: 'Read the essay', essayKind: 'Essay', articleKind: 'Article', talkKind: 'Talk', projectKind: 'Project',
    kinds: { 'Journal articles': 'Article', 'Conference papers': 'Conference', 'Preprints and working papers': 'Preprint', Reports: 'Report' },
    aboutLine: 'I study the structural energy and economic mechanisms through which digitalization and AI reshape the relationship between information, computation, electricity systems, and climate pathways.',
    convergence: {
      transmit: 'transmit', compute: 'compute', store: 'store',
      loop: 'a capital that reproduces itself',
      play: 'set in motion',
      pause: 'stop the motion',
      economy: 'economics', energy: 'biophysics', climate: 'climate',
      alt: 'On the left, three functions of information, transmitting, computing and storing, arrive each in its own time and meet in one line. At the centre, in red, the open circle of a capital that reproduces itself. From it the line reaches, on the right, the heart of three overlapping circles: the economy, the biophysical world and the climate.',
    },
    swirl: {
      alt: 'Three threads, one for each function of information, wind in towards today. The stroke says what electricity does in each: dotted while the function works without depending on it; thin once electricity makes the operation or holds a state (transmitting in 1837, computing in 1946, the working memory of storing in 1970); thick once energy is held continuously for the service to stay available (1895, 1958, 1991). Between 1975 and 2007 the three tighten into one knot, on a common substrate.',
      key: 'The three functions wind in towards today; between 1975 and 2007 they compose on one substrate. The stroke says what electricity does in each. A date marks a first architecture, not the regime of all that is installed.',
      legend: [
        'no constitutive dependence on electricity',
        'electricity makes the operation or holds a state: 1837, 1946, 1970',
        'energy held continuously for availability: 1895, 1958, 1991',
      ],
      hint: 'Point at a dot to read it.',
      core: '1975–2007 · the three functions compose on a common digital substrate',
      frise: 'Move along the timeline to travel through time: the threads above follow.',
      open: 'Open the timeline full size',
      friseSolo: 'Move along the timeline to travel through time.',
    },
    homeLead: 'I study the structural energy and economic mechanisms through which digitalization and AI reshape the relationship between information, computation, electricity systems, and climate pathways.',
    views: 'The views expressed here are my own.',
    weight: 'This page weighs {n} kB.',
    epigraph: 'The art of progress is to preserve order amid change, and to preserve change amid order.',
    none: 'Nothing listed here yet.',
    otherLang: 'Français', inEnglish: '',
    groups: { 'Journal articles': 'Journal articles', 'Conference papers': 'Conference papers', 'Preprints and working papers': 'Preprints and working papers', Reports: 'Reports' },
    and: ' and ', or: ' or ', reach: 'You can reach me through ',
    etAl: 'et al.', homeTimeline: 'Timeline', homePaper: 'Latest paper', allPapers: 'All papers', contact: 'Contact',
    meso: 'Mesoeconomics', macro: 'Macroeconomics', mesoNote: 'Semiconductors, in preparation.', inPreparation: 'In preparation.',
    aboutText: [
      'I am Rémi Paccou. I study the structural energy and economic mechanisms through which digitalization and AI reshape the relationship between information, computation, electricity systems, and climate pathways.',
      'Trained as a generalist engineer with a specialization in thermodynamics at Arts et Métiers, and with business experience at UNC Kenan-Flagler and INSEAD, I have spent over 15 years at Schneider Electric connecting R&D, strategy, and operations. For the past 5 years, I have worked as a Director of Research at the Schneider Electric Research Institute. At CIRED, I am writing a doctoral thesis on how digitalization enters energy-climate scenarios, drawing on economics, energy and the history of techniques.',
      'My work focuses on the conditions under which digital technologies emerge, scale, and affect energy and economic systems. I examine the systemic channels linking computation, electricity demand, energy infrastructure, productivity, labor, market structure, finance, geography, and decarbonization. I develop analytical and modeling frameworks to understand when digitalization acts as an efficiency lever, when it creates rebound effects or systemic instability, and what deployment contexts can stabilize positive environmental and economic outcomes.',
      'This work combines engineering, energy systems analysis, energy economics, climate scenario analysis, and macro-energy modeling, with applications to corporate strategy, public policy, and academic research.',
    ],
    portraitAlt: 'Portrait of Rémi Paccou',
  },
  fr: {
    title: 'Information, énergie et écologie',
    description: "Articles, essais et projets de recherche de Rémi Paccou sur l’information, l’énergie et l’écologie.",
    heading: "Explorer les motifs de l’information, entre nature et société",
    articles: 'Articles', essays: 'Essais', projects: 'Projets', research: 'Recherche', books: 'Livre', fields: 'Domaines', talks: 'Interventions', about: 'À propos',
    notices: 'Actualités', themes: 'Domaines', follow: 'Suivre', more: 'Lire la suite', rss: 'Flux RSS',
    readEssay: "Lire l’essai (en anglais)", essayKind: 'Essai', articleKind: 'Article', talkKind: 'Intervention', projectKind: 'Projet',
    kinds: { 'Journal articles': 'Article', 'Conference papers': 'Communication', 'Preprints and working papers': 'Prépublication', Reports: 'Rapport' },
    aboutLine: "J’étudie les mécanismes structurels, énergétiques et économiques, par lesquels la numérisation et l’IA transforment la relation entre l’information, le calcul, les systèmes électriques et les trajectoires climatiques.",
    convergence: {
      transmit: 'transmettre', compute: 'calculer', store: 'stocker',
      loop: 'un capital qui se reproduit',
      play: 'mettre en mouvement',
      pause: 'arrêter le mouvement',
      economy: 'économie', energy: 'biophysique', climate: 'climat',
      alt: "À gauche, trois fonctions de l’information, transmettre, calculer et stocker, arrivent chacune à son heure et se rejoignent en une seule ligne. Au centre, en rouge, le cercle ouvert d’un capital qui se reproduit. De là, la ligne atteint, à droite, le cœur de trois cercles qui se recouvrent : l’économie, le monde biophysique et le climat.",
    },
    swirl: {
      alt: "Trois fils, un par fonction de l’information, s’enroulent vers aujourd’hui. Le trait dit ce que l’électricité y fait : pointillé tant que la fonction n’en dépend pas ; fin quand l’électricité fait l’opération ou maintient un état (transmettre en 1837, calculer en 1946, la mémoire de travail du stockage en 1970) ; épais quand l’énergie est tenue en continu pour que le service reste disponible (1895, 1958, 1991). Entre 1975 et 2007, les trois se resserrent en un seul nœud, sur un même substrat.",
      key: "Les trois fonctions s’enroulent vers aujourd’hui ; entre 1975 et 2007, elles se composent sur un même substrat. Le trait dit ce que l’électricité fait dans chacune. Une date marque une première architecture, non le régime de tout le parc installé.",
      legend: [
        'hors dépendance électrique constitutive',
        'l’électricité fait l’opération ou maintient un état : 1837, 1946, 1970',
        'énergie tenue en continu pour la disponibilité : 1895, 1958, 1991',
      ],
      hint: 'Survoler un point pour le lire.',
      core: '1975–2007 · les trois fonctions se composent sur un même substrat numérique',
      frise: 'Parcourir la frise pour voyager dans le temps : les fils, au-dessus, suivent.',
      open: 'Ouvrir la frise en grand',
      friseSolo: 'Parcourir la frise pour voyager dans le temps.',
    },
    homeLead: "J’étudie les mécanismes structurels, énergétiques et économiques, par lesquels la numérisation et l’IA transforment la relation entre l’information, le calcul, les systèmes électriques et les trajectoires climatiques.",
    views: "Les opinions exprimées ici n’engagent que moi.",
    weight: 'Cette page pèse {n} ko.',
    epigraph: "L’art du progrès consiste à préserver l’ordre au sein du changement, et à préserver le changement au sein de l’ordre.",
    none: "Rien n’est encore répertorié ici.",
    otherLang: 'English', inEnglish: 'en anglais',
    groups: { 'Journal articles': 'Articles de revue', 'Conference papers': 'Actes de conférence', 'Preprints and working papers': 'Prépublications et documents de travail', Reports: 'Rapports' },
    and: ' et ', or: ' ou ', reach: 'Vous pouvez me joindre par ',
    etAl: 'et al.', homeTimeline: 'Frise', homePaper: 'Dernier article', allPapers: 'Tous les articles', contact: 'Contact',
    meso: 'Mésoéconomie', macro: 'Macroéconomie', mesoNote: 'Les semi-conducteurs, en préparation.', inPreparation: 'En préparation.',
    aboutText: [
      "Je suis Rémi Paccou. J’étudie les mécanismes structurels, énergétiques et économiques, par lesquels la numérisation et l’IA transforment la relation entre l’information, le calcul, les systèmes électriques et les trajectoires climatiques.",
      "Ingénieur généraliste des Arts et Métiers, spécialisé en thermodynamique, formé au management à UNC Kenan-Flagler et à l’INSEAD, j’ai passé plus de 15 ans chez Schneider Electric à relier la R&D, la stratégie et les opérations. Depuis 5 ans, je suis directeur de recherche à l’institut de recherche de Schneider Electric. Au CIRED, je prépare une thèse sur la place de la numérisation dans les scénarios énergie-climat, entre économie, énergie et histoire des techniques.",
      "Mon travail porte sur les conditions dans lesquelles les technologies numériques émergent, changent d’échelle et agissent sur les systèmes énergétiques et économiques. J’examine les canaux systémiques qui relient le calcul, la demande d’électricité, les infrastructures énergétiques, la productivité, le travail, la structure des marchés, la finance, la géographie et la décarbonation. Je construis des cadres d’analyse et de modélisation pour comprendre quand la numérisation agit comme un levier d’efficacité, quand elle crée des effets rebond ou une instabilité systémique, et quels contextes de déploiement peuvent stabiliser des effets environnementaux et économiques positifs.",
      "Ce travail réunit l’ingénierie, l’analyse des systèmes énergétiques, l’économie de l’énergie, l’analyse de scénarios climatiques et la modélisation macro-énergétique, avec des applications à la stratégie d’entreprise, aux politiques publiques et à la recherche académique.",
    ],
    portraitAlt: 'Portrait de Rémi Paccou',
  },
} as const;
