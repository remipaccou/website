// Research projects, shown on /projects/ and under their field.
//   theme   'history', 'economics' or 'biophysics'
export interface Project {
  title: { en: string; fr: string };
  text: { en: string; fr: string };
  theme: 'history' | 'economics' | 'biophysics' | 'climate';
  period?: string; // '2024–2027'
  url?: string;
  // A drawing shown under the text: a file in public/figures/, black on transparent.
  // 'src' may be one file, or one per language: { en: '...', fr: '...' }.
  figure?: { src: string | { en: string; fr: string }; alt: { en: string; fr: string }; caption?: { en: string; fr: string } };
}

export const projects: Project[] = [
  {
    title: {
      en: 'Transmit, store, compute: timelines of information techniques, 1790–2025',
      fr: "Transmettre, stocker, calculer : frises des techniques de l'information, 1790-2025",
    },
    text: {
      en: 'Work in progress.',
      fr: 'Travail en cours.',
    },
    theme: 'history',
    period: '2024–2027',
    figure: {
      // The English drawing is made from the French one by scripts/timeline-en.py.
      src: { en: '/figures/2026-10-11-three-functions.en.svg', fr: '/figures/2026-10-11-three-functions.svg' },
      alt: {
        en: 'Timeline of information techniques from 1790 to 2025, arranged by function: transmit, store, compute.',
        fr: "Frise des techniques de l'information de 1790 à 2025, rangées par fonction : transmettre, stocker, calculer.",
      },
      caption: {
        en: 'Each line follows one function of information, transmitting, computing or storing, from its first technique to the present. A hollow circle marks a patent or a demonstration, a filled one the first lasting service; lines that end in a dagger are lineages that died out, and the grey ones are alternatives that were set aside. The thickness of a line tells how far the technique depends on electricity, from none to energy drawn continuously, and the grey band at the foot shows the electric grid each function came to join. On the right the three lines meet in the cloud.',
        fr: "Chaque ligne suit une fonction de l'information, transmettre, calculer ou stocker, de sa première technique à aujourd'hui. Un cercle vide marque un brevet ou une démonstration, un point plein la première mise en service durable ; les lignes terminées par une croix sont des lignées éteintes, et les grises des alternatives écartées. L'épaisseur du trait dit à quel point la technique dépend de l'électricité, de pas du tout à une énergie mobilisée en continu, et la bande grise du bas montre le réseau électrique auquel chaque fonction s'est raccordée. À droite, les trois lignes se rejoignent dans le nuage.",
      },
    },
  },
];
