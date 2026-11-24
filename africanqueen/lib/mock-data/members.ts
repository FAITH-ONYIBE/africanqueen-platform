export type Member = {
  id: string;
  name: string;
  country: string;
  headline: string;
  skills: string[];
  badges: number;
  points: { month: number; year: number; all: number };
  role: 'member' | 'admin';
  status: 'Active' | 'Suspended';
  joinedAt: string;
};

const first = ['Amara', 'Zainab', 'Kemi', 'Wanjiru', 'Akosua', 'Nalongo', 'Folake', 'Aisha', 'Mercy', 'Esther', 'Ife', 'Naledi', 'Chidinma', 'Abena', 'Sarah', 'Hadiza', 'Joy', 'Ruth', 'Blessing', 'Fatima', 'Lindiwe', 'Salma', 'Patience', 'Mariam', 'Tendai', 'Yetunde', 'Halima', 'Faith'];
const last = ['Eze', 'Bello', 'Adebayo', 'Njoroge', 'Owusu', 'Nakato', 'Okafor', 'Yusuf', 'Wambui', 'Mensah', 'Ibrahim', 'Dlamini', 'Nwosu', 'Boateng', 'Achieng', 'Musa', 'Obi', 'Tetteh', 'Sule', 'Kariuki', 'Banda', 'Ali', 'Etim', 'Diallo', 'Moyo', 'Balogun', 'Abubakar', 'Mutesi'];
const countries = ['Nigeria', 'Kenya', 'Ghana', 'Uganda', 'Nigeria', 'South Africa', 'Rwanda', 'Nigeria'];
const heads = ['Data analyst', 'Frontend developer', 'Cybersecurity student', 'Product designer', 'Cloud engineer trainee', 'Software engineer', 'Data science student', 'QA analyst'];
const skillPool = ['Python', 'SQL', 'React', 'Excel', 'Figma', 'AWS', 'Networking', 'JavaScript', 'Power BI', 'Security'];

export const members: Member[] = first.map((f, i) => {
  const base = 2400 - i * 71 + ((i * 37) % 90);
  return {
    id: `mem-${i + 1}`,
    name: `${f} ${last[i]}`,
    country: countries[i % countries.length],
    headline: heads[i % heads.length],
    skills: [skillPool[i % 10], skillPool[(i * 3 + 1) % 10], skillPool[(i * 7 + 2) % 10]],
    badges: Math.max(1, 9 - Math.floor(i / 3)),
    points: { month: Math.round(base * 0.12 + ((i * 13) % 40)), year: Math.round(base * 0.7), all: base },
    role: i === 5 ? 'admin' : 'member',
    status: i % 11 === 4 ? 'Suspended' : 'Active',
    joinedAt: `202${4 + (i % 3)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
  };
});
export const MEMBER_COUNTRIES = ['All countries', 'Nigeria', 'Kenya', 'Ghana', 'Uganda', 'South Africa', 'Rwanda'];
