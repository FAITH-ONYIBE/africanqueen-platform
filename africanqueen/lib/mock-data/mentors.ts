export type Mentor = {
  id: string;
  name: string;
  title: string;
  company: string;
  school: string;
  country: string;
  domain: string;
  bio: string;
  skills: string[];
  languages: string[];
  availability: string;
  menteesHelped: number;
  active: boolean;
};

export const MENTOR_DOMAINS = ['Any domain', 'Data Science', 'Software Engineering', 'Cybersecurity', 'Product & Design', 'Cloud & DevOps'];

export const mentorsSeed: Mentor[] = [
  { id: 'm-ngozi', name: 'Ngozi Adeyemi', title: 'Senior Data Scientist', company: 'Kora Analytics', school: 'University of Ibadan', country: 'Nigeria', domain: 'Data Science', bio: 'I help women move from spreadsheets into data science. Five years building forecasting and customer analytics models for fintech and retail.', skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'], languages: ['English', 'Yoruba'], availability: '2 sessions per month, evenings WAT', menteesHelped: 34, active: true },
  { id: 'm-wanjiru', name: 'Wanjiru Kamau', title: 'Cloud Solutions Engineer', company: 'BrightPath Labs', school: 'Strathmore University', country: 'Kenya', domain: 'Cloud & DevOps', bio: 'Cloud and infrastructure engineer who loves explaining how the internet actually works. I mentor on certifications and first cloud roles.', skills: ['AWS', 'Networking', 'Linux', 'Terraform'], languages: ['English', 'Swahili'], availability: '1 session per week, weekends', menteesHelped: 41, active: true },
  { id: 'm-efua', name: 'Efua Mensah', title: 'Full-Stack Engineer', company: 'Tidal Payments', school: 'KNUST', country: 'Ghana', domain: 'Software Engineering', bio: 'Full-stack engineer passionate about system design. I help women prepare for technical interviews and build portfolio projects.', skills: ['JavaScript', 'React', 'Node.js', 'System Design'], languages: ['English', 'Twi'], availability: '2 sessions per month', menteesHelped: 27, active: true },
  { id: 'm-grace', name: 'Grace Atim', title: 'Security Analyst', company: 'Ridgeway Security', school: 'University of Lagos', country: 'Nigeria', domain: 'Cybersecurity', bio: 'I work in a security operations centre and mentor beginners on certifications, home labs and getting that first SOC role.', skills: ['Security', 'SOC', 'Networking', 'Python'], languages: ['English', 'Igbo'], availability: 'Weekday evenings, 1 per month', menteesHelped: 19, active: true },
  { id: 'm-lillian', name: 'Lillian Namutebi', title: 'Product Designer', company: 'Pamoja Studio', school: 'Makerere University', country: 'Uganda', domain: 'Product & Design', bio: 'Product designer focused on health and education. I review portfolios and coach on user research and storytelling.', skills: ['UX Research', 'Figma', 'Prototyping', 'Portfolio'], languages: ['English', 'Luganda'], availability: '2 sessions per month', menteesHelped: 23, active: true },
  { id: 'm-chiamaka', name: 'Chiamaka Obi', title: 'Engineering Manager', company: 'Orbit Commerce', school: 'Covenant University', country: 'Nigeria', domain: 'Software Engineering', bio: 'Engineering manager who coaches on career growth, promotions and leading teams. Happy to do CV reviews.', skills: ['Leadership', 'Java', 'Career Growth', 'AWS'], languages: ['English'], availability: '1 session per month', menteesHelped: 38, active: true },
  { id: 'm-tolu', name: 'Tolu Bankole', title: 'Startup Founder', company: 'Lumen Health', school: 'University of Cape Town', country: 'South Africa', domain: 'Product & Design', bio: 'Founder of a health-tech startup. I mentor on validating ideas, early customers and applying for grants.', skills: ['Product Strategy', 'Fundraising', 'User Research'], languages: ['English', 'Yoruba'], availability: 'Limited - 1 session per quarter', menteesHelped: 12, active: false },
  { id: 'm-aisha', name: 'Aisha Bello', title: 'Machine Learning Engineer', company: 'Savanna Health', school: 'Ahmadu Bello University', country: 'Nigeria', domain: 'Data Science', bio: 'Building machine learning systems for healthcare. I mentor students who want to break into ML engineering.', skills: ['PyTorch', 'Deep Learning', 'Python', 'MLOps'], languages: ['English', 'Hausa'], availability: '2 sessions per month', menteesHelped: 16, active: true },
];

/** Simple, explainable matching: skill overlap + domain + goal keywords. */
export function matchMentors(list: Mentor[], skills: string, goal: string, domain: string) {
  const tokens = (s: string) => s.toLowerCase().split(/[,\s]+/).map((t) => t.trim()).filter((t) => t.length > 1);
  const mySkills = tokens(skills);
  const myGoal = tokens(goal);
  return list
    .filter((m) => m.active)
    .map((m) => {
      const mentorTokens = m.skills.flatMap((s) => tokens(s));
      const text = `${m.title} ${m.bio} ${m.domain}`.toLowerCase();
      let score = 0;
      mySkills.forEach((t) => mentorTokens.includes(t) && (score += 3));
      myGoal.forEach((t) => text.includes(t) && (score += 2));
      if (domain && domain !== 'Any domain' && m.domain === domain) score += 4;
      return { mentor: m, score };
    })
    .filter((r) => (skills || goal || (domain && domain !== 'Any domain')) ? r.score > 0 : true)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.mentor);
}
