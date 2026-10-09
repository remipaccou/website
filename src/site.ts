// Everything that appears on several pages lives here.
export const site = {
  author: 'Rémi Paccou',
  title: 'Information, energy and ecology',
  description:
    'Essays and papers by Rémi Paccou on information, energy and ecology.',
  // One line, shown in the side column of the home page.
  about: 'I work on what information technologies do to energy systems and to the climate.',
  nav: [
    { label: 'Essays', path: '/writing/' },
    { label: 'Papers', path: '/publications/' },
    // Shown only once src/data/talks.ts has an entry.
    { label: 'Talks', path: '/talks/' },
    { label: 'About', path: '/about/' },
  ],
  // Leave a value empty to hide the link.
  links: {
    email: '',
    github: 'https://github.com/remipaccou',
    linkedin: '',
    orcid: '',
    scholar: '',
  },
};
