import { useMemo } from 'react';
import type { Sprint, Task, TaskWithSprint } from '../types';
import { STATUS_COLORS, TASK_STATUS } from '../constants';
import moment from 'moment';

export const useChartData = (tasks: Task[], sprints: Sprint[]) => {
  const sprintMap = useMemo(() => {
    const sprintMap: Record<string, Sprint> = {};
    sprints.forEach((sprint) => {
      sprintMap[sprint.id] = sprint;
    });
    return sprintMap;
  }, [sprints]);

  const tasksWithSprints: TaskWithSprint[] = useMemo(() => {
    return tasks.map((task) => {
      if (sprintMap[task.sprint_id]) {
        return { ...task, sprint: sprintMap[task.sprint_id] };
      }
      return task;
    });
  }, [tasks, sprintMap]);

  const memberAvgCapacity = useMemo(() => {
    const doneTasks = tasksWithSprints.filter((t) => t.status === TASK_STATUS.COMPLETED);
    if (doneTasks.length === 0) return [];

    // Group tasks by sprint_id and member
    const memberSprintData: {
      [memberName: string]: {
        [sprintId: string]: number;
      };
    } = {};

    doneTasks.forEach((task) => {
      if (!task.sprint_id) return; // Skip if still no sprint_id
      task.owners.forEach((owner) => {
        if (!memberSprintData[owner.name]) {
          memberSprintData[owner.name] = {};
        }
        if (!memberSprintData[owner.name][task.sprint_id]) {
          memberSprintData[owner.name][task.sprint_id] = 0;
        }
        memberSprintData[owner.name][task.sprint_id] += owner.point;
      });
    });

    // Calculate average for each member
    return Object.keys(memberSprintData)
      .map((name) => {
        const sprintPoints = Object.values(memberSprintData[name]);
        const totalPoints = sprintPoints.reduce((sum, points) => sum + points, 0);
        const numberOfSprints = sprintPoints.length;
        const wipAverage = parseFloat((totalPoints / numberOfSprints).toFixed(2));

        return {
          name,
          wipAverage,
        };
      })
      .sort((a, b) => b.wipAverage - a.wipAverage);
  }, [tasksWithSprints]);

  const teamAvgCapacity = useMemo(() => {
    const doneTasks = tasksWithSprints.filter((t) => t.status === TASK_STATUS.COMPLETED);
    if (doneTasks.length === 0) return 0;

    // Group completed tasks by sprint_id and sum their points
    const sprintTotals: { [sprintId: string]: number } = {};

    doneTasks.forEach((task) => {
      if (!task.sprint_id) return; // Skip if still no sprint_id
      if (!sprintTotals[task.sprint_id]) {
        sprintTotals[task.sprint_id] = 0;
      }
      sprintTotals[task.sprint_id] += Number(task.total_point);
    });

    const totalPoints = Object.values(sprintTotals).reduce((sum, points) => sum + points, 0);
    const numberOfSprints = Object.keys(sprintTotals).length;

    return parseFloat((totalPoints / numberOfSprints).toFixed(2));
  }, [tasksWithSprints]);

  const statusDistribution = useMemo(() => {
    const counts: { [key in Task['status']]: number } = {
      'To do': 0,
      'In progress': 0,
      Completed: 0,
      Blocked: 0,
    };
    tasksWithSprints.forEach((task) => {
      counts[task.status] += Number(task.total_point);
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      fill: STATUS_COLORS[name as keyof typeof STATUS_COLORS],
    }));
  }, [tasksWithSprints]);

  const monthlyProgress = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth - 1;
    const twoMonthsAgo = currentMonth - 2;
    const threeMonthsAgo = currentMonth - 3;

    const currentMonthDoneTasks = tasksWithSprints.filter(
      (t) =>
        t.status === TASK_STATUS.COMPLETED && moment(t?.sprint?.end_date).month() === currentMonth,
    );
    const lastMonthDoneTasks = tasksWithSprints.filter(
      (t) =>
        t.status === TASK_STATUS.COMPLETED && moment(t?.sprint?.end_date).month() === lastMonth,
    );
    const twoMonthsAgoDoneTasks = tasksWithSprints.filter(
      (t) =>
        t.status === TASK_STATUS.COMPLETED && moment(t?.sprint?.end_date).month() === twoMonthsAgo,
    );
    const threeMonthsAgoDoneTasks = tasksWithSprints.filter(
      (t) =>
        t.status === TASK_STATUS.COMPLETED &&
        moment(t?.sprint?.end_date).month() === threeMonthsAgo,
    );

    return [
      {
        name: '3 Months Ago',
        points: threeMonthsAgoDoneTasks.reduce((sum, task) => sum + Number(task.total_point), 0),
      },
      {
        name: '2 Months Ago',
        points: twoMonthsAgoDoneTasks.reduce((sum, task) => sum + Number(task.total_point), 0),
      },
      {
        name: 'Last Month',
        points: lastMonthDoneTasks.reduce((sum, task) => sum + Number(task.total_point), 0),
      },
      {
        name: 'This Month',
        points: currentMonthDoneTasks.reduce((sum, task) => sum + Number(task.total_point), 0),
      },
    ];
  }, [tasksWithSprints]);

  return {
    memberAvgCapacity,
    teamAvgCapacity,
    statusDistribution,
    monthlyProgress,
  };
};
