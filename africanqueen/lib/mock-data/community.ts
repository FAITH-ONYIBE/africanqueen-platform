export type Reply = { id: string; author: string; body: string; at: string; pendingId?: string };
export type Thread = { id: string; title: string; category: string; author: string; body: string; at: string; replies: Reply[]; pendingId?: string };
export const THREAD_CATEGORIES = ['All topics', 'Career', 'Learning', 'Opportunities', 'Introductions'];

export const threadsSeed: Thread[] = [
  { id: 't1', title: 'How I passed my networking exam on my second try', category: 'Learning', author: 'Zainab Bello', body: 'I failed the first time because I memorised instead of practising. The second time I built a small lab and the questions made sense. Happy to share my study plan if it helps.', at: '2026-11-19', replies: [
    { id: 'r1', author: 'Kemi Adebayo', body: 'Please share the plan! Which lab tools did you use?', at: '2026-11-19' },
    { id: 'r2', author: 'Zainab Bello', body: 'Free simulator tools, plus 30 minutes every morning. I will post the plan in Resources this week.', at: '2026-11-20' },
  ] },
  { id: 't2', title: 'Interview in two weeks: any tips for a data analyst role?', category: 'Career', author: 'Esther Njoroge', body: 'First interview for a junior analyst role. They said there will be a SQL test and a short case. What should I practise?', at: '2026-11-21', replies: [
    { id: 'r3', author: 'Ngozi Adeyemi', body: 'Practise joins, GROUP BY and window functions. For the case, say your assumptions out loud before calculating.', at: '2026-11-21' },
  ] },
  { id: 't3', title: 'Scholarship deadline reminders thread', category: 'Opportunities', author: 'Programme Admin', body: 'Post any deadlines you spot here so everyone can plan. Please include the link and the closing date.', at: '2026-11-15', replies: [] },
  { id: 't4', title: 'Hello from Kigali!', category: 'Introductions', author: 'Mutesi Ruth', body: 'New member here, learning Python and looking for study partners in East Africa.', at: '2026-11-22', replies: [
    { id: 'r4', author: 'Wambui Achieng', body: 'Welcome! There is a weekly study call on Saturdays, details in Events.', at: '2026-11-22' },
  ] },
];
