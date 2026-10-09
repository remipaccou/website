// Talks, shown on /talks/ and in the notices of the home page.
// Add an entry and the Talks link appears in the menu.
//   date   'YYYY-MM' or 'YYYY-MM-DD'
export interface Talk { date: string; title: string; event: string; place?: string; url?: string }

export const talks: Talk[] = [
  // { date: '2026-06', title: 'Title of the talk', event: 'Name of the conference', place: 'City' },
];
