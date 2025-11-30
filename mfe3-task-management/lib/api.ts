import { supabase } from './supabase';
import type { Task, Sprint } from '@/types';

export const PAGE_SIZE = 1000;

export type FetchTasksParams = {
  filterValue: string; // 'all_time' | 'current_sprint' | sprintId | '2025-11'
  searchQuery?: string;
  page?: number;
  pageSize?: number;
};

export type FetchTasksResult = {
  tasks: Task[];
  totalCount: number;
  totalPages: number;
};

const transformTask = (t: any): Task => ({
  id: t.id,
  user_id: t.user_id,
  sprint_id: t.sprint_id,
  task: t.task,
  link: t.link || '',
  total_point: t.total_point,
  label: t.label,
  priority: t.priority,
  status: t.status,
  percent: t.percent || '',
  notes: t.notes || '',
  owners: t.owners || [],
  created_at: t.created_at,
  updated_at: t.updated_at,
});

export const fetchTasks = async ({
  filterValue,
  searchQuery = '',
  page = 1,
  pageSize = PAGE_SIZE,
}: FetchTasksParams): Promise<FetchTasksResult> => {
  let query = supabase
    .from('tasks')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false });

  // === 1. Apply Filter ===
  if (filterValue !== 'all_time' && filterValue.length === 36) {
    // Specific sprint UUID
    query = query.eq('sprint_id', filterValue);
  } else if (filterValue.length === 7) {
    // Month filter: '2025-11'
    const { data: sprintsInMonth } = await supabase
      .from('sprints')
      .select('id')
      .or(`start_date.like.${filterValue}%,end_date.like.${filterValue}%`);

    if (!sprintsInMonth?.length) {
      return { tasks: [], totalCount: 0, totalPages: 0 };
    }
    query = query.in(
      'sprint_id',
      sprintsInMonth.map((s) => s.id),
    );
  }

  // === 2. Apply Search ===
  // Apply search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();

    query = query.or(`task.ilike.%${q}%,label.ilike.%${q}%,priority.ilike.%${q}%`);
  }

  // === 3. Pagination ===
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  return {
    tasks: data.map(transformTask),
    totalCount: count ?? 0,
    totalPages,
  };
};
