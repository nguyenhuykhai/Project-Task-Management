'use client';

import React from 'react';
import { useTaskStore } from '../store/taskStore';
import type { Task } from '../types';
import { Edit, Trash2, ExternalLink, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { TASK_STATUS } from '@/constants';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

/* -------------------------------------------------
   CONFIG
   ------------------------------------------------- */
const MAX_INLINE_OWNERS = 1; // ≤ 5 → real columns
const MAX_DISPLAY_IN_CELL = 3; // In collapsed mode, show only 3 + "more"
const SHOW_OTHERS_COLUMN = true; // show “Others” when > MAX_INLINE_OWNERS

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit }) => {
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const sprints = useTaskStore((state) => state.sprints);

  const sprintMap = React.useMemo(() => new Map(sprints.map((s) => [s.id, s.name])), [sprints]);

  /* -------------------------------------------------
     1. Owner statistics (used for header + tooltips)
     ------------------------------------------------- */
  const ownerStats = React.useMemo(() => {
    const map = new Map<string, { total: number; tasks: number }>();

    tasks.forEach((t) =>
      t.owners.forEach((o) => {
        const cur = map.get(o.name) ?? { total: 0, tasks: 0 };
        map.set(o.name, {
          total: cur.total + o.point,
          tasks: cur.tasks + 1,
        });
      }),
    );

    return Array.from(map.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.total - a.total);
  }, [tasks]);

  const visibleOwnerNames = ownerStats.slice(0, MAX_INLINE_OWNERS).map((o) => o.name);

  const hasOthers = ownerStats.length > MAX_INLINE_OWNERS;

  /* -------------------------------------------------
     2. Totals
     ------------------------------------------------- */
  const totals = React.useMemo(() => {
    const total = tasks.reduce((a, t) => a + t.total_point, 0);
    const done = tasks
      .filter((t) => t.status === TASK_STATUS.COMPLETED)
      .reduce((a, t) => a + t.total_point, 0);
    return { total, done, pending: total - done };
  }, [tasks]);

  const getStatusVariant = (s: Task['status']): 'default' | 'secondary' | 'outline' => {
    return s === TASK_STATUS.COMPLETED
      ? 'default'
      : s === TASK_STATUS.IN_PROGRESS
        ? 'secondary'
        : 'outline';
  };

  /* -------------------------------------------------
     3. Owner cell renderer (inline columns OR tooltip)
     ------------------------------------------------- */
  const OwnerCell: React.FC<{ owners: Task['owners']; taskName: string }> = ({
    owners,
    taskName,
  }) => {
    if (owners.length === 0) {
      return <TableCell className="text-muted-foreground">–</TableCell>;
    }

    // CASE A: Show inline columns if ≤ MAX_INLINE_OWNERS total owners in sprint
    if (!hasOthers) {
      const map = new Map(owners.map((o) => [o.name, o.point]));
      return (
        <>
          {visibleOwnerNames.map((name) => {
            const p = map.get(name);
            return (
              <TableCell key={name} className="text-center hidden lg:table-cell">
                {p !== undefined ? (
                  <Badge variant="secondary" className="text-xs">
                    {p}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">–</span>
                )}
              </TableCell>
            );
          })}
        </>
      );
    }

    // CASE B: Collapsed view with "Show more" dialog
    const displayedOwners = owners.slice(0, MAX_DISPLAY_IN_CELL);
    const remainingCount = owners.length - displayedOwners.length;

    return (
      <TableCell className="max-w-xs">
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-1 text-left hover:underline focus:outline-none">
              <Users size={14} className="text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {displayedOwners.map((o, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {o.name}: {o.point}
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{remainingCount} more
                  </span>
                )}
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Owners for: <span className="font-medium">{taskName}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              {owners.map((o, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span className="font-medium">{o.name}</span>
                  <Badge variant="secondary">{o.point} pts</Badge>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    );
  };

  /* -------------------------------------------------
     4. Header columns count (used for empty‑state colspan)
     ------------------------------------------------- */
  const headerColumnCount = React.useMemo(() => {
    // Task | Sprint | (owner columns) | Status | Actions
    let cnt = 4; // Task, Status, Actions + Sprint (hidden on sm)
    if (!hasOthers) cnt += visibleOwnerNames.length;
    else cnt += 1; // “Owners” column
    return cnt;
  }, [hasOthers, visibleOwnerNames.length]);

  return (
    <div className="space-y-6">
      {/* ---------- TABLE ---------- */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Task</TableHead>
                <TableHead className="hidden sm:table-cell font-semibold">Sprint</TableHead>

                {/* Inline owner columns */}
                {!hasOthers &&
                  visibleOwnerNames.map((name) => (
                    <TableHead
                      key={name}
                      className="text-center font-semibold hidden lg:table-cell"
                    >
                      {name}
                    </TableHead>
                  ))}

                {/* Collapsed “Owners” column */}
                {hasOthers && <TableHead className="font-semibold">Owners</TableHead>}

                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-muted/50 transition-colors">
                    {/* Task */}
                    <TableCell className="font-medium max-w-xs">
                      <div className="flex items-center gap-2">
                        {task.link ? (
                          <a
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:underline text-primary font-medium"
                          >
                            {task.task}
                            <ExternalLink size={14} className="text-muted-foreground" />
                          </a>
                        ) : (
                          <span className="font-medium">{task.task}</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Sprint */}
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {sprintMap.get(task.sprint_id) || 'N/A'}
                    </TableCell>

                    {/* Owner points */}
                    <OwnerCell owners={task.owners} taskName={task.task} />

                    {/* Status */}
                    <TableCell>
                      <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(task)}
                          className="h-8 w-8"
                        >
                          <Edit size={16} />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.confirm('Are you sure?') && deleteTask(task.id)}
                          className="h-8 w-8 hover:text-destructive"
                        >
                          <Trash2 size={16} />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headerColumnCount}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg">No tasks found</p>
                      <p className="text-sm">Try adjusting your filter or add a new task.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ---------- SUMMARY CARD ---------- */}
      {tasks.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold text-primary">{totals.total}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totals.done}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {totals.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskTable;
