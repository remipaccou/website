// Books, shown on /books/ and under their field.
import transmitCover from '../assets/book-transmit-store-compute.png';
export interface Book {
  title: { en: string; fr: string };
  subtitle: { en: string; fr: string };
  status: { en: string; fr: string }; // 'In progress', or year and publisher
  text?: { en: string; fr: string };
  theme: 'history' | 'economics' | 'biophysics' | 'climate';
  url?: string;
  // A photograph of the cover, in src/assets/. Without it the site draws one.
  image?: ImageMetadata;
  imageAlt?: { en: string; fr: string };
  // The cover is drawn by the site (src/components/BookCover.astro), with
  // the three verbs of the title set vertically in Japanese.
  cover?: { japanese: string[] };
}

export const books: Book[] = [
  {
    title: { en: 'Transmit, Store, Compute', fr: 'Transmettre, stocker, calculer' },
    subtitle: {
      en: 'A natural history of information',
      fr: "Une histoire naturelle de l'information",
    },
    status: { en: 'In progress', fr: 'En cours' },
    text: { en: 'On the emergence of information as an economic order.', fr: "De l'émergence de l'information comme ordre économique." },
    theme: 'history',
    image: transmitCover,
    imageAlt: {
      en: 'Cover of Transmit, Store, Compute: a dark grey book with the title in white and, in large black lettering, the three verbs in Japanese.',
      fr: "Couverture de Transmettre, stocker, calculer : un livre gris sombre, le titre en blanc et, en grandes lettres noires, les trois verbes en japonais.",
    },
  },
];
