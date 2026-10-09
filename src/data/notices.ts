// Hand-written notices for the home page (a paper accepted, a translation,
// an interview). Essays, papers and talks are listed there automatically.
//   date   'YYYY-MM' or 'YYYY-MM-DD'
export interface ManualNotice { date: string; kind: string; text: string; detail?: string; url?: string }

export const notices: ManualNotice[] = [
  // { date: '2026-10', kind: 'News', text: 'Paper accepted', detail: 'Energy Policy' },
];
