// Research projects, shown on /projects/ and under their field.
//   theme   'history', 'economics' or 'biophysics'
export interface Project {
  title: { en: string; fr: string };
  text: { en: string; fr: string };
  theme: 'history' | 'economics' | 'biophysics';
  period?: string; // '2024–2027'
  url?: string;
}

export const projects: Project[] = [
  // {
  //   title: { en: 'Title of the project', fr: 'Titre du projet' },
  //   text: { en: 'Two or three sentences.', fr: 'Deux ou trois phrases.' },
  //   theme: 'economics',
  //   period: '2024–2027',
  // },
];
