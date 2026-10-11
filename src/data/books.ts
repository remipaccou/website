// Books, shown on /books/ and under their field.
export interface Book {
  title: { en: string; fr: string };
  subtitle: { en: string; fr: string };
  status: { en: string; fr: string }; // 'In progress', or year and publisher
  text?: { en: string; fr: string };
  theme: 'history' | 'economics' | 'biophysics' | 'climate';
  url?: string;
  // The cover is drawn by the site (src/components/BookCover.astro), with
  // the three verbs of the title set vertically in Japanese.
  cover: { japanese: string[] };
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
    cover: { japanese: ['伝送', '蓄積', '計算'] },
  },
];
