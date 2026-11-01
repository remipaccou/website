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

// The fields the work is filed under, each with the Greek word it comes from
// and the sentence that introduces its page. Philosophy comes after the four,
// set apart and in red: it looks at the whole rather than at a part.
export const themes = [
  { id: 'history', en: 'History', fr: 'Histoire', greek: 'ἱστορία', line: { en: 'How the techniques that transmit, store and compute found their place in the economy, and who came to pay for them.', fr: "Comment les techniques qui transmettent, conservent et calculent ont trouvé leur place dans l’économie, et qui a fini par les payer." } },
  { id: 'economics', en: 'Economics', fr: 'Économie', greek: 'οἰκονομία', line: { en: 'What computing does to the price and to the value of electricity.', fr: "Ce que le calcul fait au prix et à la valeur de l’électricité." } },
  { id: 'biophysics', en: 'Biophysics', fr: 'Biophysique', greek: 'φύσις', line: { en: 'The energy and the heat that information requires, and the limits the Earth sets to them.', fr: "L’énergie et la chaleur que demande l’information, et les limites que la Terre leur fixe." } },
  { id: 'climate', en: 'Climate', fr: 'Climat', greek: 'κλίμα', line: { en: 'Where digital infrastructures meet the trajectories of the climate.', fr: 'Là où les infrastructures numériques rencontrent les trajectoires du climat.' } },
  { id: 'philosophy', en: 'Philosophy', fr: 'Philosophie', greek: 'τέχνη', apart: true, line: { en: 'Thinking about technics, with Simondon, Stiegler and Yuk Hui.', fr: 'Penser la technique, avec Simondon, Stiegler et Yuk Hui.' } },
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
    aboutLine: 'I work on what information technologies do to energy systems and to the climate.',
    convergence: {
      transmit: 'transmit', compute: 'compute', store: 'store',
      loop: 'a capital that reproduces itself',
      play: 'set in motion',
      pause: 'stop the motion',
      economy: 'economics', energy: 'biophysics', climate: 'climate',
      alt: 'A drawing in mirror. On the left, three overlapping circles: the functions of information, transmitting, storing and computing, composed on one substrate. In the middle, in red, the open circle of a capital that reproduces itself, fed by them. On the right, three overlapping circles it reaches through their heart: the economy, the biophysical world and the climate.',
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
    homeLead: 'I work on what information technologies do to energy systems and to the climate. The essays and papers gathered here follow the techniques that transmit, store and compute: how they found their place in the economy, the electricity they draw, and the limits the Earth sets to them.',
    views: 'The views expressed here are my own.',
    weight: 'This page weighs {n} kB.',
    epigraph: 'The art of progress is to preserve order amid change, and to preserve change amid order.',
    none: 'Nothing listed here yet.',
    otherLang: 'Français', inEnglish: '',
    groups: { 'Journal articles': 'Journal articles', 'Conference papers': 'Conference papers', 'Preprints and working papers': 'Preprints and working papers', Reports: 'Reports' },
    and: ' and ', or: ' or ', reach: 'You can reach me through ',
    aboutText: [
      'I am Rémi Paccou. I work on what information technologies do to energy systems and to the climate.',
      "I direct sustainability research at Schneider Electric's research institute. At CIRED, I am writing a doctoral thesis on how digitalisation enters energy-climate scenarios, drawing on economics, energy and the history of techniques.",
      'I trained as an engineer in thermodynamics at Arts et Métiers.',
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
    aboutLine: "Je travaille sur ce que les technologies de l’information font aux systèmes énergétiques et au climat.",
    convergence: {
      transmit: 'transmettre', compute: 'calculer', store: 'stocker',
      loop: 'un capital qui se reproduit',
      play: 'mettre en mouvement',
      pause: 'arrêter le mouvement',
      economy: 'économie', energy: 'biophysique', climate: 'climat',
      alt: "Un dessin en miroir. À gauche, trois cercles qui se recouvrent : les fonctions de l’information, transmettre, stocker et calculer, composées sur un même substrat. Au milieu, en rouge, le cercle ouvert d’un capital qui se reproduit, qu’elles nourrissent. À droite, trois cercles qu’il atteint par leur cœur : l’économie, le monde biophysique et le climat.",
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
    homeLead: "Je travaille sur ce que les technologies de l’information font aux systèmes énergétiques et au climat. Les essais et articles réunis ici suivent les techniques qui transmettent, conservent et calculent : comment elles ont trouvé leur place dans l’économie, l’électricité qu’elles consomment, et les limites que la Terre leur fixe.",
    views: "Les opinions exprimées ici n’engagent que moi.",
    weight: 'Cette page pèse {n} ko.',
    epigraph: "L’art du progrès consiste à préserver l’ordre au sein du changement, et à préserver le changement au sein de l’ordre.",
    none: "Rien n’est encore répertorié ici.",
    otherLang: 'English', inEnglish: 'en anglais',
    groups: { 'Journal articles': 'Articles de revue', 'Conference papers': 'Actes de conférence', 'Preprints and working papers': 'Prépublications et documents de travail', Reports: 'Rapports' },
    and: ' et ', or: ' ou ', reach: 'Vous pouvez me joindre par ',
    aboutText: [
      "Je suis Rémi Paccou. Je travaille sur ce que les technologies de l’information font aux systèmes énergétiques et au climat.",
      "Je dirige la recherche en durabilité de l’institut de recherche de Schneider Electric. Au CIRED, je prépare une thèse sur la place de la numérisation dans les scénarios énergie-climat, entre économie, énergie et histoire des techniques.",
      'Je suis ingénieur des Arts et Métiers, formé à la thermodynamique.',
    ],
    portraitAlt: 'Portrait de Rémi Paccou',
  },
} as const;
