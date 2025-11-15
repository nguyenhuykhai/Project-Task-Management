import type { Task, Sprint } from './types';

export const INITIAL_SPRINTS: Sprint[] = [
  { id: 'sprint-1', name: 'July Sprint 1', startDate: '2024-07-01', endDate: '2024-07-15' },
  { id: 'sprint-2', name: 'July Sprint 2', startDate: '2024-07-16', endDate: '2024-07-31' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    sprintId: 'sprint-1',
    task: "[SPRINT] Profile Center -> Profile Setting",
    link: "https://github.com/example/repo/issues/1",
    totalPoint: 8,
    label: "MUST HAVE",
    priority: "High",
    status: "Done",
    percent: "100%",
    notes: "Initial setup for user profiles.",
    owners: [{ name: "Nam", point: 8 }]
  },
  {
    id: '2',
    sprintId: 'sprint-1',
    task: "[SPRINT] Profile Center -> My Profile",
    link: "https://github.com/example/repo/issues/2",
    totalPoint: 8,
    label: "MUST HAVE",
    priority: "High",
    status: "In progress",
    percent: "80%",
    notes: "Display user details.",
    owners: [{ name: "Cang", point: 4 }, { name: "Trường", point: 4 }]
  },
  {
    id: '3',
    sprintId: 'sprint-1',
    task: "[SPRINT] Profile Center -> eKYC Verification",
    link: "https://github.com/example/repo/issues/3",
    totalPoint: 3,
    label: "MUST HAVE",
    priority: "High",
    status: "Done",
    percent: "100%",
    notes: "ID verification flow.",
    owners: [{ name: "Nam", point: 1.5 }, { name: "Tuấn", point: 1.5 }]
  },
  {
    id: '4',
    sprintId: 'sprint-2',
    task: "Savings -> Savings Dashboard",
    link: "https://github.com/example/repo/issues/4",
    totalPoint: 12,
    label: "MUST HAVE",
    priority: "High",
    status: "Done",
    percent: "100%",
    notes: "Main dashboard for savings accounts.",
    owners: [{ name: "Huy", point: 6 }, { name: "Quý", point: 6 }]
  },
  {
    id: '5',
    sprintId: 'sprint-2',
    task: "[SPRINT] Budget Detail Chart",
    link: "https://github.com/example/repo/issues/5",
    totalPoint: 3,
    label: "SHOULD HAVE",
    priority: "Low",
    status: "In progress",
    percent: "50%",
    notes: "Complex charting feature.",
    owners: [{ name: "Phúc", point: 3 }]
  }
];

export const STATUS_COLORS = {
  'In progress': '#3b82f6', // blue-500
  'Done': '#22c55e', // green-500
  'To Do': '#a8a29e', // stone-400
};

export const MEMBER_COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', 
    '#ffbb28', '#ff7300', '#d0ed57', '#a4de6c', '#8dd1e1', '#83a6ed'
];
