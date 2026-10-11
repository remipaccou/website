// Research projects, shown on /projects/ and under their field.
//   theme   'history', 'economics' or 'biophysics'
export interface Project {
  title: { en: string; fr: string };
  text: { en: string; fr: string };
  theme: 'history' | 'economics' | 'biophysics' | 'climate';
  period?: string; // '2024–2027'
  url?: string;
  // A drawing shown under the text: a file in public/figures/, black on transparent.
  figure?: { src: string; alt: { en: string; fr: string }; caption?: { en: string; fr: string } };
}

export const projects: Project[] = [
  {
    title: {
      en: 'Transmit, store, compute: timelines of information techniques, 1790–2025',
      fr: "Transmettre, stocker, calculer : frises des techniques de l'information, 1790-2025",
    },
    text: {
      en: 'Work in progress: some dates remain to be checked. The figure is in French.',
      fr: 'Travail en cours : certaines dates restent à vérifier.',
    },
    theme: 'history',
    period: '2024–2027',
    figure: {
      src: '/figures/2026-10-11-three-functions.svg',
      alt: {
        en: 'Timeline of information techniques from 1790 to 2025, arranged by function: transmit, store, compute.',
        fr: "Frise des techniques de l'information de 1790 à 2025, rangées par fonction : transmettre, stocker, calculer.",
      },
    },
  },
];
