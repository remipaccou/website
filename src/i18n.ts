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

// The fields the work is filed under.
export const themes = [
  { id: 'history', en: 'History', fr: 'Histoire' },
  { id: 'economics', en: 'Economics', fr: 'Économie' },
  { id: 'biophysics', en: 'Biophysics', fr: 'Biophysique' },
  { id: 'climate', en: 'Climate', fr: 'Climat' },
] as const;
export type ThemeId = (typeof themes)[number]['id'];

export const ui = {
  en: {
    title: 'Information, energy and ecology',
    description: 'Articles, essays and research projects by Rémi Paccou on information, energy and ecology.',
    triad: ['Information', 'Energy', 'Ecology'],
    articles: 'Articles', essays: 'Essays', projects: 'Research projects', talks: 'Talks', about: 'About',
    notices: 'Notices', themes: 'Fields', follow: 'Follow', more: 'More', rss: 'RSS feed',
    readEssay: 'Read the essay', essayKind: 'Essay', articleKind: 'Article', talkKind: 'Talk', projectKind: 'Project',
    aboutLine: 'I work on what information technologies do to energy systems and to the climate.',
    views: 'The views expressed here are my own.',
    epigraph: 'What we observe is not nature itself, but nature exposed to our method of questioning.',
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
    triad: ['Information', 'Énergie', 'Écologie'],
    articles: 'Articles', essays: 'Essais', projects: 'Projets de recherche', talks: 'Interventions', about: 'À propos',
    notices: 'Actualités', themes: 'Domaines', follow: 'Suivre', more: 'Lire la suite', rss: 'Flux RSS',
    readEssay: "Lire l'essai (en anglais)", essayKind: 'Essai', articleKind: 'Article', talkKind: 'Intervention', projectKind: 'Projet',
    aboutLine: "Je travaille sur ce que les technologies de l'information font aux systèmes énergétiques et au climat.",
    views: "Les opinions exprimées ici n'engagent que moi.",
    epigraph: "Ce que nous observons, ce n'est pas la nature en soi, mais la nature exposée à notre méthode d'investigation.",
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
