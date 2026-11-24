export type Announcement = { id: string; title: string; body: string; category: 'Programme' | 'Event' | 'Opportunity' | 'Community'; at: string; pinned?: boolean };

export const announcementsSeed: Announcement[] = [
  { id: 'a1', title: 'Mentor applications for the January cohort are open', body: 'Mentees can now request a mentor for the January cohort. Requests close on 15 December. Complete your profile first so mentors can see your goals.', category: 'Programme', at: '2026-11-21', pinned: true },
  { id: 'a2', title: 'Data Mondays move to 17:00 WAT', body: 'From 30 November, Data Monday sessions start at 17:00 West Africa Time so more members can join after work.', category: 'Event', at: '2026-11-18' },
  { id: 'a3', title: 'New: Women Founders Seed Grant listed', body: 'A new grant of up to $10,000 is open to women-led startups. See Opportunities for requirements and the deadline.', category: 'Opportunity', at: '2026-11-15' },
  { id: 'a4', title: 'Community guidelines updated', body: 'We clarified how to give feedback respectfully and how to report concerns. Please read them before posting in discussions.', at: '2026-11-08', category: 'Community' },
];

export type Resource = { id: string; title: string; type: 'Guide' | 'Template' | 'Video' | 'Cheat sheet'; topic: string; minutes: number; summary: string; body: string };
export const RESOURCE_TYPES = ['All types', 'Guide', 'Template', 'Video', 'Cheat sheet'];

export const resources: Resource[] = [
  { id: 'res-cv', title: 'One-page CV template for tech roles', type: 'Template', topic: 'Career', minutes: 10, summary: 'A clean layout with advice on what recruiters look for.', body: 'Keep it to one page. Lead with a two-line summary, then projects, then experience. For each item write what you did, how, and the result (for example: "Reduced report time from 2 hours to 15 minutes using SQL"). Link to your portfolio or GitHub. Avoid photos, long paragraphs and skill bars.' },
  { id: 'res-sql', title: 'SQL cheat sheet', type: 'Cheat sheet', topic: 'Data', minutes: 5, summary: 'The 20 commands you will use every week.', body: 'SELECT, WHERE, ORDER BY, LIMIT. GROUP BY with COUNT, SUM, AVG. JOIN types: INNER, LEFT. Filtering groups with HAVING. Window functions: ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...). Tip: write the query in small steps and check the row count after each join.' },
  { id: 'res-interview', title: 'Interview preparation guide', type: 'Guide', topic: 'Career', minutes: 20, summary: 'How to prepare for technical and behavioural interviews.', body: 'Prepare three stories using Situation, Task, Action, Result. Research the company product. Practise explaining your projects in two minutes. Ask two questions at the end about the team and how success is measured. Send a thank-you note within 24 hours.' },
  { id: 'res-network', title: 'Networking fundamentals: the big picture', type: 'Video', topic: 'Learning', minutes: 35, summary: 'A plain-language tour of IP, DNS, routing and switching.', body: 'Summary notes: data travels in packets; IP addresses identify devices; DNS maps names to addresses; routers connect networks; switches connect devices within a network. Practise subnetting daily for one week and it will feel natural.' },
  { id: 'res-grant', title: 'How to write a grant application', type: 'Guide', topic: 'Funding', minutes: 25, summary: 'Structure, budget and storytelling for first-time applicants.', body: 'Answer four questions clearly: what problem, who is affected, what will you do, and how will you know it worked. Keep the budget simple and linked to activities. Use one real story. Have someone outside your field read it.' },
  { id: 'res-portfolio', title: 'Build a portfolio that gets replies', type: 'Guide', topic: 'Career', minutes: 15, summary: 'Three projects, clear write-ups, no fluff.', body: 'Choose three projects. For each: the problem, your approach, a screenshot, and what you learned. Host it for free and add a short About page. Quality beats quantity.' },
  { id: 'res-python', title: 'Python starter notebook', type: 'Template', topic: 'Data', minutes: 30, summary: 'A guided notebook with exercises and answers.', body: 'Covers variables, lists, loops, functions and a small pandas example. Work through one section per day and write your own comments explaining each line.' },
  { id: 'res-salary', title: 'Negotiating your first offer', type: 'Video', topic: 'Career', minutes: 18, summary: 'Scripts and examples for a first salary conversation.', body: 'Research ranges, state your number as a range with the bottom at what you would happily accept, and ask about growth and learning budget. Always thank them and ask for time to consider.' },
];

export type Notification = { id: string; title: string; text: string; at: string; read: boolean; kind: 'mentor' | 'event' | 'opportunity' | 'system' };
export const notificationsSeed: Notification[] = [
  { id: 'n1', title: 'New mentor match', text: 'Ngozi Adeyemi matches your skills in Python and SQL.', at: '2026-11-22', read: false, kind: 'mentor' },
  { id: 'n2', title: 'Event tomorrow', text: 'Data Monday: Cleaning Messy Data starts at 17:00.', at: '2026-11-22', read: false, kind: 'event' },
  { id: 'n3', title: 'Deadline approaching', text: 'Junior Data Analyst at Kora Analytics closes on 18 December.', at: '2026-11-20', read: false, kind: 'opportunity' },
  { id: 'n4', title: 'Welcome to africanqueen', text: 'Complete your profile to unlock mentor matching.', at: '2026-11-14', read: true, kind: 'system' },
];

export type MentorRequestAdmin = { id: string; mentee: string; mentor: string; goal: string; at: string; status: 'Pending' | 'Accepted' | 'Declined' };
export const adminRequestsSeed: MentorRequestAdmin[] = [
  { id: 'mr1', mentee: 'Kemi Adebayo', mentor: 'Ngozi Adeyemi', goal: 'Move from analyst to data scientist', at: '2026-11-21', status: 'Pending' },
  { id: 'mr2', mentee: 'Esther Njoroge', mentor: 'Wanjiru Kamau', goal: 'Prepare for a cloud certification', at: '2026-11-20', status: 'Pending' },
  { id: 'mr3', mentee: 'Mercy Nakato', mentor: 'Efua Mensah', goal: 'Interview practice for frontend roles', at: '2026-11-17', status: 'Accepted' },
  { id: 'mr4', mentee: 'Faith Moyo', mentor: 'Grace Atim', goal: 'Enter a security operations role', at: '2026-11-12', status: 'Declined' },
];
