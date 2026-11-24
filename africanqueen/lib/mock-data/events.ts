export type EventType = 'Webinar' | 'Workshop' | 'Meetup' | 'Data Monday';
export type EventItem = {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  country: 'Online' | 'Nigeria' | 'Kenya' | 'Ghana' | 'Uganda';
  capacity: number;
  registered: number;
  summary: string;
  description: string;
  speakers: string[];
};

export const events: EventItem[] = [
  { id: 'ev-data-monday-1130', title: 'Data Monday: Cleaning Messy Data', type: 'Data Monday', date: '2026-11-30', time: '17:00', location: 'Online', country: 'Online', capacity: 300, registered: 212, summary: 'A hands-on hour of spreadsheets, SQL and Python for real, messy datasets.', description: 'Bring a laptop. We clean a real survey dataset together using spreadsheets, SQL and a short Python notebook. No prior experience needed; beginners are welcome.', speakers: ['Ngozi Adeyemi', 'Wanjiru Kamau'] },
  { id: 'ev-cyber-101', title: 'Cybersecurity Careers: Where Do I Start?', type: 'Webinar', date: '2026-12-03', time: '16:00', location: 'Online', country: 'Online', capacity: 500, registered: 341, summary: 'Three practitioners explain the entry routes into security roles.', description: 'A panel on certifications, first-job roles and how to build a home lab on a low budget. Includes live Q&A.', speakers: ['Efua Mensah', 'Grace Atim', 'Lillian Namutebi'] },
  { id: 'ev-lagos-meetup', title: 'Lagos Women in Tech Meetup', type: 'Meetup', date: '2026-12-12', time: '11:00', location: 'Yaba, Lagos', country: 'Nigeria', capacity: 80, registered: 61, summary: 'Meet members, mentors and hiring partners in person.', description: 'Lightning talks, a mentor speed-networking round and a CV clinic. Lunch is provided. Please register early; places are limited.', speakers: ['Chiamaka Obi', 'Tolu Bankole'] },
  { id: 'ev-cloud-workshop', title: 'Cloud Fundamentals Workshop', type: 'Workshop', date: '2026-12-17', time: '10:00', location: 'Nairobi Innovation Hub', country: 'Kenya', capacity: 40, registered: 38, summary: 'Deploy your first app and learn the core cloud concepts employers ask about.', description: 'A full-day workshop covering compute, storage, networking and identity. You leave with a deployed project for your portfolio.', speakers: ['Wanjiru Kamau'] },
  { id: 'ev-data-monday-1214', title: 'Data Monday: Dashboards That Persuade', type: 'Data Monday', date: '2026-12-14', time: '17:00', location: 'Online', country: 'Online', capacity: 300, registered: 98, summary: 'Turn a table of numbers into a one-page story for decision makers.', description: 'We design a simple dashboard and practise explaining it in two minutes. Suitable for analysts and non-analysts.', speakers: ['Ngozi Adeyemi'] },
  { id: 'ev-accra-code', title: 'Accra Build Night', type: 'Workshop', date: '2027-01-16', time: '14:00', location: 'Osu, Accra', country: 'Ghana', capacity: 60, registered: 22, summary: 'Pair up and ship a small web project in one evening.', description: 'Teams of two build and deploy a small web project with mentor support. All levels welcome; bring a laptop and a charger.', speakers: ['Efua Mensah'] },
  { id: 'ev-kampala-careers', title: 'Kampala Careers Day', type: 'Meetup', date: '2027-02-06', time: '09:30', location: 'Kampala', country: 'Uganda', capacity: 120, registered: 15, summary: 'Employer stands, interview practice and mentor office hours.', description: 'A day for students and early-career women: employer conversations, mock interviews and portfolio reviews.', speakers: ['Lillian Namutebi'] },
  { id: 'ev-ai-webinar-past', title: 'AI for Beginners', type: 'Webinar', date: '2026-11-10', time: '16:00', location: 'Online', country: 'Online', capacity: 500, registered: 487, summary: 'What AI can and cannot do, explained without jargon.', description: 'A beginner-friendly introduction to modern AI tools and how members are using them at work. Recording available to members.', speakers: ['Grace Atim'] },
  { id: 'ev-abuja-workshop-past', title: 'Abuja CV and Interview Clinic', type: 'Workshop', date: '2026-10-24', time: '10:00', location: 'Wuse, Abuja', country: 'Nigeria', capacity: 50, registered: 50, summary: 'One-to-one CV reviews and mock interviews.', description: 'Forty members received a personal CV review and a mock interview with a hiring manager.', speakers: ['Chiamaka Obi'] },
  { id: 'ev-data-monday-past', title: 'Data Monday: SQL in 60 Minutes', type: 'Data Monday', date: '2026-11-16', time: '17:00', location: 'Online', country: 'Online', capacity: 300, registered: 256, summary: 'Queries, joins and aggregates for complete beginners.', description: 'We wrote our first ten queries against a sample sales database. Slides and the practice database are in Resources.', speakers: ['Wanjiru Kamau'] },
  { id: 'ev-nairobi-past', title: 'Nairobi Founders Breakfast', type: 'Meetup', date: '2026-09-19', time: '08:30', location: 'Westlands, Nairobi', country: 'Kenya', capacity: 45, registered: 44, summary: 'Early-stage founders trade lessons and introductions.', description: 'A small breakfast for women building startups, with three short founder stories and open networking.', speakers: ['Tolu Bankole'] },
];

export const EVENT_TYPES = ['All types', 'Webinar', 'Workshop', 'Meetup', 'Data Monday'];
export const EVENT_COUNTRIES = ['All locations', 'Online', 'Nigeria', 'Kenya', 'Ghana', 'Uganda'];
