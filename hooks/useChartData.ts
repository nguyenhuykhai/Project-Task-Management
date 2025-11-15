import { useMemo } from 'react';
import type { Task } from '../types';
import { STATUS_COLORS } from '../constants';

export const useChartData = (tasks: Task[]) => {

  const memberWipAverage = useMemo(() => {
    const doneTasks = tasks.filter(t => t.status === 'Done');
    if (doneTasks.length === 0) return [];

    const memberPoints: { [key: string]: number } = {};
    const memberTaskCount: { [key: string]: number } = {};

    doneTasks.forEach(task => {
      task.owners.forEach(owner => {
        memberPoints[owner.name] = (memberPoints[owner.name] || 0) + owner.point;
        memberTaskCount[owner.name] = (memberTaskCount[owner.name] || 0) + 1;
      });
    });

    return Object.keys(memberPoints).map(name => ({
      name,
      wipAverage: parseFloat((memberPoints[name] / memberTaskCount[name]).toFixed(2)),
    })).sort((a, b) => b.wipAverage - a.wipAverage);
  }, [tasks]);

  const teamWipAverage = useMemo(() => {
    if (!memberWipAverage || memberWipAverage.length === 0) return 0;
    const totalAverage = memberWipAverage.reduce((sum, member) => sum + member.wipAverage, 0);
    return parseFloat((totalAverage / memberWipAverage.length).toFixed(2));
  }, [memberWipAverage]);

  const statusDistribution = useMemo(() => {
    const counts: { [key in Task['status']]: number } = {
      'To Do': 0,
      'In progress': 0,
      'Done': 0,
    };
    tasks.forEach(task => {
        counts[task.status] += task.totalPoint;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      fill: STATUS_COLORS[name as keyof typeof STATUS_COLORS],
    }));
  }, [tasks]);
  
  const sprintProgress = useMemo(() => {
      // Mock data for sprint progress line chart
      const totalPoints = tasks.reduce((sum, t) => sum + t.totalPoint, 0);
      const donePoints = tasks.filter(t=> t.status === 'Done').reduce((sum, t) => sum + t.totalPoint, 0);
      const idealPace = totalPoints / 5; // 5 stages

      return [
        { name: 'Start', ideal: totalPoints, actual: totalPoints },
        { name: 'Day 3', ideal: totalPoints - idealPace * 1 },
        { name: 'Day 5', ideal: totalPoints - idealPace * 2.5, actual: totalPoints - (donePoints * 0.5) },
        { name: 'Day 7', ideal: totalPoints - idealPace * 4 },
        { name: 'End', ideal: 0, actual: totalPoints - donePoints },
      ];
  }, [tasks]);

  const monthlyProgress = useMemo(() => {
      // Mock data for monthly trend based on done tasks
      const donePoints = tasks.filter(t => t.status === 'Done').reduce((sum, t) => sum + t.totalPoint, 0);
      
      return [
          { name: '3 Months Ago', points: donePoints * 0.7 },
          { name: '2 Months Ago', points: donePoints * 0.8 },
          { name: 'Last Month', points: donePoints * 1.1 },
          { name: 'This Month', points: donePoints },
      ];
  }, [tasks]);

  return { memberWipAverage, teamWipAverage, statusDistribution, sprintProgress, monthlyProgress };
};
