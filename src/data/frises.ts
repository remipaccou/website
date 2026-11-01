// The thesis timelines shown on the site, each with its two languages and where
// the years fall in it (see figures-src/: build.sh draws the confluence and
// transmit files from the thesis sources, calibrate.py measures them).
import measured from './frises.json';

type Lang = 'en' | 'fr';
export type Region = { y0: number; y1: number; stops: number[][] };
export type Cal = { w: number; h: number; regions: Region[] };
export interface Frise {
  src: Record<Lang, string>;
  cal: Record<Lang, Cal>;
  title: Record<Lang, string>;
  alt: Record<Lang, string>;
}

// The first timeline only had its letters replaced in English: same geometry.
const tree: Cal = { w: 781.746, h: 433.283, regions: [{ y0: 0, y1: 362, stops: [[1790, 87.95], [2030, 665.15]] }] };

export const frises: Record<'tree' | 'confluence' | 'transmit', Frise> = {
  tree: {
    src: { fr: '/figures/2026-10-11-three-functions.svg', en: '/figures/2026-10-11-three-functions.en.svg' },
    cal: { fr: tree, en: tree },
    title: { en: '', fr: '' },
    alt: {
      en: 'Timeline of information techniques from 1790 to 2025, arranged by function: transmit, store, compute.',
      fr: "Frise des techniques de l’information de 1790 à 2025, rangées par fonction : transmettre, stocker, calculer.",
    },
  },
  confluence: {
    src: { fr: '/figures/2026-10-11-confluence.svg', en: '/figures/2026-10-11-confluence.en.svg' },
    cal: measured.confluence as Record<Lang, Cal>,
    title: {
      en: 'From situated techniques to a worldwide capital: the emergences brought together, 1790–2025',
      fr: 'Des techniques situées au capital mondial : les émergences réunies, 1790-2025',
    },
    alt: {
      en: 'Timeline from 1790 to 2025: techniques of transmitting, computing and storing, each with its place, payer and form, join into a single stock of capital; a band below follows that stock from 1969 to 2025.',
      fr: "Frise de 1790 à 2025 : des techniques de transmission, de calcul et de stockage, chacune avec son lieu, son payeur et sa forme, se rejoignent en un seul fonds ; un bandeau suit ce fonds de 1969 à 2025.",
    },
  },
  transmit: {
    src: { fr: '/figures/2026-10-11-transmit.svg', en: '/figures/2026-10-11-transmit.en.svg' },
    cal: measured.transmit as Record<Lang, Cal>,
    title: {
      en: 'Transmitting, 1835–1932: the lineages and what passes between them',
      fr: 'Transmettre, 1835-1932 : les lignées et ce qui passe entre elles',
    },
    alt: {
      en: 'Timeline of transmitting from 1835 to 1932: telegraph, telephone, radio and broadcasting, with the forms, substrates and problems that pass from one lineage to another.',
      fr: "Frise de la transmission de 1835 à 1932 : télégraphe, téléphone, radio et radiodiffusion, avec les formes, les substrats et les problèmes qui passent d’une lignée à l’autre.",
    },
  },
};
