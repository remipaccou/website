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
// and the sentence that introduces its page.
export const themes = [
  { id: 'history', en: 'History', fr: 'Histoire', greek: 'ἱστορία', line: { en: 'How the techniques that transmit, store and compute found their place in the economy, and who came to pay for them.', fr: "Comment les techniques qui transmettent, conservent et calculent ont trouvé leur place dans l'économie, et qui a fini par les payer." } },
  { id: 'economics', en: 'Economics', fr: 'Économie', greek: 'οἰκονομία', line: { en: 'What computing does to the price and to the value of electricity.', fr: "Ce que le calcul fait au prix et à la valeur de l'électricité." } },
  { id: 'biophysics', en: 'Biophysics', fr: 'Biophysique', greek: 'φύσις', line: { en: 'The energy and the heat that information requires, and the limits the Earth sets to them.', fr: "L'énergie et la chaleur que demande l'information, et les limites que la Terre leur fixe." } },
  { id: 'climate', en: 'Climate', fr: 'Climat', greek: 'κλίμα', line: { en: 'Where digital infrastructures meet the trajectories of the climate.', fr: 'Là où les infrastructures numériques rencontrent les trajectoires du climat.' } },
] as const;
export type ThemeId = (typeof themes)[number]['id'];

export const ui = {
  en: {
    title: 'Information, energy and ecology',
    description: 'Articles, essays and research projects by Rémi Paccou on information, energy and ecology.',
    // The large title of the home page: the core of the research, in one sentence.
    heading: 'Exploring the patterns of information across nature and society',
    articles: 'Articles', essays: 'Essays', projects: 'Research projects', books: 'Books', fields: 'Fields', talks: 'Talks', about: 'About',
    notices: 'Notices', themes: 'Fields', follow: 'Follow', more: 'More', rss: 'RSS feed',
    readEssay: 'Read the essay', essayKind: 'Essay', articleKind: 'Article', talkKind: 'Talk', projectKind: 'Project',
    aboutLine: 'I work on what information technologies do to energy systems and to the climate.',
    views: 'The views expressed here are my own.',
    respond: 'Write a response', respondSubject: 'Response to',
    epigraph: 'The art of progress is to preserve order amid change, and to preserve change amid order.',
    none: 'Nothing listed here yet.',
    otherLang: 'Français', inEnglish: '',
    groups: { 'Journal articles': 'Journal articles', 'Conference papers': 'Conference papers', 'Preprints and working papers': 'Preprints and working papers', Reports: 'Reports' },
    and: ' and ', or: ' or ', reach: 'You can reach me through ',
    aboutText: [
      "I am Rémi Paccou. I work on what information technologies do to energy systems and to the climate, as a doctoral researcher at CIRED and at Schneider Electric's research institute.",
      'I trained as an engineer in thermodynamics at Arts et Métiers.',
    ],
    portraitAlt: 'Portrait of Rémi Paccou',
  },
  fr: {
    title: 'Information, énergie et écologie',
    description: "Articles, essais et projets de recherche de Rémi Paccou sur l'information, l'énergie et l'écologie.",
    heading: "Explorer les motifs de l'information, entre nature et société",
    articles: 'Articles', essays: 'Essais', projects: 'Projets de recherche', books: 'Livres', fields: 'Domaines', talks: 'Interventions', about: 'À propos',
    notices: 'Actualités', themes: 'Domaines', follow: 'Suivre', more: 'Lire la suite', rss: 'Flux RSS',
    readEssay: "Lire l'essai (en anglais)", essayKind: 'Essai', articleKind: 'Article', talkKind: 'Intervention', projectKind: 'Projet',
    aboutLine: "Je travaille sur ce que les technologies de l'information font aux systèmes énergétiques et au climat.",
    views: "Les opinions exprimées ici n'engagent que moi.",
    respond: 'Écrire une réponse', respondSubject: 'Réponse à',
    epigraph: "L'art du progrès consiste à préserver l'ordre au sein du changement, et à préserver le changement au sein de l'ordre.",
    none: "Rien n'est encore répertorié ici.",
    otherLang: 'English', inEnglish: 'en anglais',
    groups: { 'Journal articles': 'Articles de revue', 'Conference papers': 'Actes de conférence', 'Preprints and working papers': 'Prépublications et documents de travail', Reports: 'Rapports' },
    and: ' et ', or: ' ou ', reach: 'Vous pouvez me joindre par ',
    aboutText: [
      "Je suis Rémi Paccou. Je travaille sur ce que les technologies de l'information font aux systèmes énergétiques et au climat, comme doctorant au CIRED et à l'institut de recherche de Schneider Electric.",
      'Je suis ingénieur des Arts et Métiers, formé à la thermodynamique.',
    ],
    portraitAlt: 'Portrait de Rémi Paccou',
  },
} as const;
