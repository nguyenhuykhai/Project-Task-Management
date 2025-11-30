export enum TASK_STATUS {
  IN_PROGRESS = 'In progress',
  COMPLETED = 'Completed',
  TODO = 'To do',
  BLOCKED = 'Blocked',
}

export enum TASK_LABEL {
  URGENT = 'URGENT',
  BLOCKER = 'BLOCKER',
  MUST_HAVE = 'MUST HAVE',
  SHOULD_HAVE = 'SHOULD HAVE',
  COULD_HAVE = 'COULD HAVE',
  WON_T_HAVE = "WON'T HAVE",
}

export enum TASK_PRIORITY {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export const STATUS_COLORS = {
  [TASK_STATUS.IN_PROGRESS]: '#3b82f6', // blue-500
  [TASK_STATUS.COMPLETED]: '#22c55e', // green-500
  [TASK_STATUS.TODO]: '#a8a29e', // stone-400
  [TASK_STATUS.BLOCKED]: '#ef4444', // red-500
};

export const MEMBER_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088fe',
  '#00c49f',
  '#ffbb28',
  '#ff7300',
  '#d0ed57',
  '#a4de6c',
  '#8dd1e1',
  '#83a6ed',
];
