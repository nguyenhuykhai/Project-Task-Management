'use client';

import { TASK_LABEL, TASK_PRIORITY, TASK_STATUS } from '@/constants';
import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import type { Owner, Sprint, Task } from '../types';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const getInitialFormData = (sprints: Sprint[]): Omit<Task, 'id'> => ({
  task: '',
  link: '',
  total_point: 0,
  label: TASK_LABEL.MUST_HAVE,
  priority: TASK_PRIORITY.MEDIUM,
  status: TASK_STATUS.TODO,
  percent: '0%',
  notes: '',
  owners: [{ name: '', point: 0 }],
  sprint_id: sprints[0]?.id || '',
  user_id: '',
  created_at: '',
  updated_at: '',
});

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, task }) => {
  const sprints = useTaskStore((state) => state.sprints);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const [formData, setFormData] = useState<Omit<Task, 'id'>>(() => getInitialFormData(sprints));
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData(task);
      } else {
        setFormData(getInitialFormData(sprints));
      }
    }
  }, [task, isOpen, sprints]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalPoint' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleOwnerChange = (index: number, field: keyof Owner, value: string) => {
    const newOwners = [...formData.owners];
    if (field === 'point') {
      newOwners[index] = {
        ...newOwners[index],
        [field]: parseFloat(value) || 0,
      };
    } else {
      newOwners[index] = { ...newOwners[index], [field]: value };
    }
    setFormData((prev) => ({ ...prev, owners: newOwners }));
  };

  const addOwner = () => {
    if (formData.owners.length < 10) {
      setFormData((prev) => ({
        ...prev,
        owners: [...prev.owners, { name: '', point: 0 }],
      }));
    }
  };

  const removeOwner = (index: number) => {
    if (formData.owners.length > 1) {
      const newOwners = formData.owners.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, owners: newOwners }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sprint_id) {
      setError('A sprint must be selected.');
      return;
    }

    const ownerPointsSum = formData.owners.reduce((sum, owner) => sum + owner.point, 0);
    if (formData.total_point !== ownerPointsSum) {
      setError(
        `Total Point (${formData.total_point}) must equal the sum of owner points (${ownerPointsSum}).`,
      );
      return;
    }
    setError('');

    if (task) {
      updateTask({ ...formData, id: task.id });
    } else {
      addTask(formData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update the task details.' : 'Create a new task for your sprint.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sprint">
                Sprint <span className="text-destructive">*</span>
              </Label>
              <select
                id="sprint"
                name="sprint_id"
                value={formData.sprint_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task">
                Task <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task"
                name="task"
                value={formData.task}
                onChange={handleChange}
                placeholder="Task name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalPoint">
                Total Point <span className="text-destructive">*</span>
              </Label>
              <Input
                id="totalPoint"
                type="number"
                step="0.1"
                name="total_point"
                value={formData.total_point}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>To do</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <select
                id="label"
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>MUST HAVE</option>
                <option>SHOULD HAVE</option>
                <option>COULD HAVE</option>
                <option>WON'T HAVE</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Owners</Label>
            {formData.owners.map((owner, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor={`owner-name-${index}`} className="text-xs">
                    Name
                  </Label>
                  <Input
                    id={`owner-name-${index}`}
                    type="text"
                    placeholder="Owner name"
                    value={owner.name}
                    onChange={(e) => handleOwnerChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor={`owner-point-${index}`} className="text-xs">
                    Points
                  </Label>
                  <Input
                    id={`owner-point-${index}`}
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={owner.point}
                    onChange={(e) => handleOwnerChange(index, 'point', e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOwner(index)}
                  disabled={formData.owners.length <= 1}
                  className="h-10 w-10"
                >
                  <X size={18} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOwner}
              disabled={formData.owners.length >= 10}
              className="w-full gap-2"
            >
              <Plus size={16} /> Add Owner
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{task ? 'Update Task' : 'Create Task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormModal;
